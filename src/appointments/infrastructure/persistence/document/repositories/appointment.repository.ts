import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppointmentSchemaClass } from '../entities/appointment.schema';
import { AppointmentRepository } from '../../appointment.repository';
import { Appointment } from '../../../../domain/appointment';
import { AppointmentMapper } from '../mappers/appointment.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class AppointmentDocumentRepository implements AppointmentRepository {
  constructor(
    @InjectModel(AppointmentSchemaClass.name)
    private readonly appointmentModel: Model<AppointmentSchemaClass>,
  ) {}

  async create(data: Appointment): Promise<Appointment> {
    const persistenceModel = AppointmentMapper.toPersistence(data);
    const createdEntity = new this.appointmentModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return AppointmentMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Appointment[]> {
    const entityObjects = await this.appointmentModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      AppointmentMapper.toDomain(entityObject),
    );
  }

  async findById(id: Appointment['id']): Promise<NullableType<Appointment>> {
    const entityObject = await this.appointmentModel.findById(id);
    return entityObject ? AppointmentMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Appointment['id'][]): Promise<Appointment[]> {
    const entityObjects = await this.appointmentModel.find({
      _id: { $in: ids },
    });
    return entityObjects.map((entityObject) =>
      AppointmentMapper.toDomain(entityObject),
    );
  }

  async findByPatientId(patientId: string): Promise<Appointment[]> {
    const appointments = await this.appointmentModel.find({
      'patientInfo.patientId': patientId,
    });
    return appointments.map((app) => AppointmentMapper.toDomain(app));
  }

  async findByDoctorId(doctorId: string): Promise<Appointment[]> {
    const appointments = await this.appointmentModel.find({
      'doctorInfo.doctorId': doctorId,
    });
    return appointments.map((app) => AppointmentMapper.toDomain(app));
  }

  async update(
    id: Appointment['id'],
    payload: Partial<Appointment>,
  ): Promise<NullableType<Appointment>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.appointmentModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const entityObject = await this.appointmentModel.findOneAndUpdate(
      filter,
      AppointmentMapper.toPersistence({
        ...AppointmentMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? AppointmentMapper.toDomain(entityObject) : null;
  }

  async remove(id: Appointment['id']): Promise<void> {
    await this.appointmentModel.deleteOne({ _id: id });
  }
}

import { Injectable } from '@nestjs/common';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DoctorSchemaClass } from '../entities/doctor.schema';
// import { UserSchemaClass } from '../../../../../users/infrastructure/persistence/document/entities/user.schema';
import { DoctorRepository } from '../../doctor.repository';
import { Doctor } from '../../../../domain/doctor';
import { DoctorMapper } from '../mappers/doctor.mapper';
import { UserMapper } from '../../../../../users/infrastructure/persistence/document/mappers/user.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class DoctorDocumentRepository implements DoctorRepository {
  constructor(
    @InjectModel(DoctorSchemaClass.name)
    private readonly doctorModel: Model<DoctorSchemaClass>,
  ) {}

  async create(data: Doctor): Promise<Doctor> {
    const persistenceModel = DoctorMapper.toPersistence(data);
    const createdAt = new Date();
    persistenceModel.createdAt = createdAt;
    const createdEntity = new this.doctorModel(persistenceModel);
    const entityObject = await createdEntity.save();
    return DoctorMapper.toDomain(entityObject);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Doctor[]> {
    const entityObjects = await this.doctorModel
      .find()
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .limit(paginationOptions.limit);

    return entityObjects.map((entityObject) =>
      DoctorMapper.toDomain(entityObject),
    );
  }

  async findAllWithPaginationAndFilters({
    paginationOptions,
    search,
    filters,
  }: {
    paginationOptions: IPaginationOptions;
    search?: string;
    filters?: { specialties?: string; city?: string };
  }): Promise<Doctor[]> {
    const matchStage: any = {};
    if (filters?.specialties) {
      matchStage.specialties = { $regex: filters.specialties, $options: 'i' };
    }
    if (filters?.city) {
      matchStage['location.city'] = { $regex: filters.city, $options: 'i' };
    }

    if (search) {
      matchStage.$or = [
        { 'userInfo.firstName': { $regex: search, $options: 'i' } },
        { 'userInfo.lastName': { $regex: search, $options: 'i' } },
        { 'userInfo.email': { $regex: search, $options: 'i' } },
      ];
    }

    const pipeline = [
      {
        $lookup: {
          from: 'userschemaclasses',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo',
          pipeline: [{ $project: { firstName: 1, lastName: 1, email: 1 } }],
        },
      },
      { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
      { $match: matchStage },
      { $skip: (paginationOptions.page - 1) * paginationOptions.limit },
      { $limit: paginationOptions.limit },
    ];

    const entityObjects = await this.doctorModel.aggregate(pipeline);

    return entityObjects.map((entityObject) => {
      const doctor = DoctorMapper.toDomain(entityObject);
      doctor.userInfo = entityObject.userInfo
        ? UserMapper.toDomain(entityObject.userInfo)
        : null;
      return doctor;
    });
  }

  async findById(id: Doctor['id']): Promise<NullableType<Doctor>> {
    const entityObject = await this.doctorModel.findById(id);
    return entityObject ? DoctorMapper.toDomain(entityObject) : null;
  }

  async findByIds(ids: Doctor['id'][]): Promise<Doctor[]> {
    const entityObjects = await this.doctorModel.find({ _id: { $in: ids } });
    return entityObjects.map((entityObject) =>
      DoctorMapper.toDomain(entityObject),
    );
  }

  async update(
    id: Doctor['id'],
    payload: Partial<Doctor>,
  ): Promise<NullableType<Doctor>> {
    const clonedPayload = { ...payload };
    delete clonedPayload.id;

    const filter = { _id: id.toString() };
    const entity = await this.doctorModel.findOne(filter);

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedAt = new Date();
    entity.updatedAt = updatedAt;

    const entityObject = await this.doctorModel.findOneAndUpdate(
      filter,
      DoctorMapper.toPersistence({
        ...DoctorMapper.toDomain(entity),
        ...clonedPayload,
      }),
      { new: true },
    );

    return entityObject ? DoctorMapper.toDomain(entityObject) : null;
  }

  async remove(id: Doctor['id']): Promise<void> {
    await this.doctorModel.deleteOne({ _id: id });
  }
}

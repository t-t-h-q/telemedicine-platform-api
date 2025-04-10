import { Appointment } from '../../../../domain/appointment';
import { AppointmentSchemaClass } from '../entities/appointment.schema';
import { Types } from 'mongoose';

export class AppointmentMapper {
  public static toDomain(raw: AppointmentSchemaClass): Appointment {
    const domainEntity = new Appointment();
    domainEntity.id = raw._id.toString();
    domainEntity.patientInfo = {
      patientId: raw.patientInfo.patientId.toString(),
      firstName: raw.patientInfo.firstName,
      lastName: raw.patientInfo.lastName,
      email: raw.patientInfo.email,
      phone: raw.patientInfo.phone,
    };
    domainEntity.doctorInfo = {
      doctorId: raw.doctorInfo.doctorId.toString(),
      firstName: raw.doctorInfo.firstName,
      lastName: raw.doctorInfo.lastName,
      email: raw.doctorInfo.email,
      phone: raw.doctorInfo.phone,
    };
    domainEntity.status = raw.status;
    domainEntity.payment = {
      method: raw.payment.method,
      status: raw.payment.status,
    };
    domainEntity.appointmentDate = raw.appointmentDate;
    domainEntity.service = raw.service;
    domainEntity.timeSlot = {
      startTime: raw.timeSlot.startTime,
      endTime: raw.timeSlot.endTime,
    };
    domainEntity.notes = raw.notes;
    domainEntity.cost = raw.cost;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(
    domainEntity: Appointment,
  ): AppointmentSchemaClass {
    const persistenceSchema = new AppointmentSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.patientInfo = {
      patientId: new Types.ObjectId(domainEntity.patientInfo.patientId),
      firstName: domainEntity.patientInfo.firstName,
      lastName: domainEntity.patientInfo.lastName,
      email: domainEntity.patientInfo.email,
      phone: domainEntity.patientInfo.phone,
    };
    persistenceSchema.doctorInfo = {
      doctorId: new Types.ObjectId(domainEntity.doctorInfo.doctorId),
      firstName: domainEntity.doctorInfo.firstName,
      lastName: domainEntity.doctorInfo.lastName,
      email: domainEntity.doctorInfo.email,
      phone: domainEntity.doctorInfo.phone,
    };
    persistenceSchema.status = domainEntity.status;
    persistenceSchema.payment = {
      method: domainEntity.payment.method,
      status: domainEntity.payment.status,
    };
    persistenceSchema.appointmentDate = domainEntity.appointmentDate;
    persistenceSchema.service = domainEntity.service;
    persistenceSchema.timeSlot = {
      startTime: domainEntity.timeSlot.startTime,
      endTime: domainEntity.timeSlot.endTime,
    };
    persistenceSchema.notes = domainEntity.notes;
    persistenceSchema.cost = domainEntity.cost;
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}

import { Doctor } from '../../../../domain/doctor';
import { DoctorSchemaClass } from '../entities/doctor.schema';
import { Types } from 'mongoose';

export class DoctorMapper {
  public static toDomain(raw: DoctorSchemaClass): Doctor {
    const domainEntity = new Doctor();
    domainEntity.id = raw._id.toString();
    domainEntity.userId = raw.userId.toString();

    domainEntity.professionalDocuments = raw.professionalDocuments;
    domainEntity.approved = raw.approved;
    domainEntity.specialties = raw.specialties;
    domainEntity.availability = raw.availability.map((slot) => ({
      dayOfWeek: slot.dayOfWeek,
      timeSlots: slot.timeSlots.map((timeSlot) => ({
        startTime: timeSlot.startTime,
        endTime: timeSlot.endTime,
      })),
    }));
    domainEntity.location = {
      city: raw.location.city,
      postalCode: raw.location.postalCode,
    };

    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  public static toPersistence(domainEntity: Doctor): DoctorSchemaClass {
    const persistenceSchema = new DoctorSchemaClass();
    if (domainEntity.id) {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.userId = new Types.ObjectId(domainEntity.userId);
    persistenceSchema.professionalDocuments =
      domainEntity.professionalDocuments;
    persistenceSchema.approved = domainEntity.approved;
    persistenceSchema.specialties = domainEntity.specialties;
    persistenceSchema.availability = domainEntity.availability
      ? domainEntity.availability.map((slot) => ({
          dayOfWeek: slot.dayOfWeek,
          timeSlots: slot.timeSlots.map((timeSlot) => ({
            startTime: timeSlot.startTime,
            endTime: timeSlot.endTime,
          })),
        }))
      : [];
    persistenceSchema.location =
      domainEntity.location &&
      domainEntity.location?.city &&
      domainEntity.location?.postalCode
        ? {
            city: domainEntity.location.city,
            postalCode: domainEntity.location.postalCode,
          }
        : { city: '', postalCode: '' };
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;

    return persistenceSchema;
  }
}

import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Appointment } from '../../domain/appointment';

export abstract class AppointmentRepository {
  abstract create(
    data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Appointment>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Appointment[]>;

  abstract findByPatientId(patientId: string): Promise<Appointment[]>;

  abstract findByDoctorId(doctorId: string): Promise<Appointment[]>;

  abstract findById(id: Appointment['id']): Promise<NullableType<Appointment>>;

  abstract findByIds(ids: Appointment['id'][]): Promise<Appointment[]>;

  abstract update(
    id: Appointment['id'],
    payload: DeepPartial<Appointment>,
  ): Promise<Appointment | null>;

  abstract remove(id: Appointment['id']): Promise<void>;
}

import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Doctor } from '../../domain/doctor';

export abstract class DoctorRepository {
  abstract create(
    data: Omit<Doctor, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Doctor>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Doctor[]>;

  abstract findAllWithPaginationAndFilters({
    paginationOptions,
    search,
    filters,
  }: {
    paginationOptions: IPaginationOptions;
    search?: string;
    filters?: Record<string, any>;
  }): Promise<Doctor[]>;

  abstract findById(id: Doctor['id']): Promise<NullableType<Doctor>>;

  abstract findByIds(ids: Doctor['id'][]): Promise<Doctor[]>;

  abstract update(
    id: Doctor['id'],
    payload: DeepPartial<Doctor>,
  ): Promise<Doctor | null>;

  abstract remove(id: Doctor['id']): Promise<void>;
}

import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { DoctorRepository } from './infrastructure/persistence/doctor.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Doctor } from './domain/doctor';

@Injectable()
export class DoctorsService {
  constructor(
    // Dependencies here
    private readonly doctorRepository: DoctorRepository,
  ) {}

  async create(createDoctorDto: CreateDoctorDto) {
    const existingDoctor = await this.doctorRepository.findById(
      createDoctorDto.userId,
    );
    if (existingDoctor) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'userAlreadyExists',
        },
      });
    }

    return this.doctorRepository.create({
      ...createDoctorDto,
      approved: false,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.doctorRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findAllWithPaginationAndFilters({
    paginationOptions,
    search,
    filters,
  }: {
    paginationOptions: IPaginationOptions;
    search?: string;
    filters?: Record<string, any>;
  }) {
    return this.doctorRepository.findAllWithPaginationAndFilters({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
      search,
      filters,
    });
  }

  findById(id: Doctor['id']) {
    return this.doctorRepository.findById(id);
  }

  findByIds(ids: Doctor['id'][]) {
    return this.doctorRepository.findByIds(ids);
  }

  async update(id: Doctor['id'], updateDoctorDto: UpdateDoctorDto) {
    return this.doctorRepository.update(id, updateDoctorDto);
  }

  remove(id: Doctor['id']) {
    return this.doctorRepository.remove(id);
  }
}

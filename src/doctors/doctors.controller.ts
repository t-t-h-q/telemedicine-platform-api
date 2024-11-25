import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Doctor } from './domain/doctor';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllDoctorsDto } from './dto/find-all-doctors.dto';

@ApiTags('Doctors')
@ApiBearerAuth()
@Controller({
  path: 'doctors',
  version: '1',
})
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Doctor,
  })
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @ApiOkResponse({
    type: InfinityPaginationResponse(Doctor),
  })
  async findAll(
    @Query() query: FindAllDoctorsDto,
  ): Promise<InfinityPaginationResponseDto<Doctor>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const search = query?.search ?? '';
    const filters: any = {};
    if (query.specialties) {
      filters.specialties = query.specialties;
    }

    if (query.city) {
      filters.city = query.city;
    }

    return infinityPagination(
      await this.doctorsService.findAllWithPaginationAndFilters({
        paginationOptions: {
          page,
          limit,
        },
        search,
        filters,
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Doctor,
  })
  findById(@Param('id') id: string) {
    return this.doctorsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Doctor,
  })
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.doctorsService.remove(id);
  }
}

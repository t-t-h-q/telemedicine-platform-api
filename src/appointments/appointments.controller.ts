import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Appointment } from './domain/appointment';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllAppointmentsDto } from './dto/find-all-appointments.dto';
import { UpdateAppointmentStatusDto } from './dto/update-appointment-status.dto';
import { UpdatePaymentDto } from './dto/update-payment-status.dto';

@ApiTags('Appointments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'appointments',
  version: '1',
})
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Appointment,
  })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Appointment),
  })
  async findAll(
    @Query() query: FindAllAppointmentsDto,
  ): Promise<InfinityPaginationResponseDto<Appointment>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.appointmentsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiOkResponse({ type: Appointment })
  async getAppointment(@Param('id') id: string): Promise<Appointment> {
    return this.appointmentsService.getAppointment(id);
  }

  @Get('patient/:patientId')
  @ApiOkResponse({ type: [Appointment] })
  async getPatientAppointments(
    @Param('patientId') patientId: string,
  ): Promise<Appointment[]> {
    return this.appointmentsService.getPatientAppointments(patientId);
  }

  @Get('doctor/:doctorId')
  @ApiOkResponse({ type: [Appointment] })
  async getDoctorAppointments(
    @Param('doctorId') doctorId: string,
  ): Promise<Appointment[]> {
    return this.appointmentsService.getDoctorAppointments(doctorId);
  }

  @Put(':id/status')
  @ApiOkResponse({ type: Appointment })
  async updateStatus(
    @Param('id') id: string,
    @Body() statusDto: UpdateAppointmentStatusDto,
  ): Promise<Appointment> {
    return this.appointmentsService.updateAppointmentStatus(
      id,
      statusDto.status,
    );
  }

  @Put(':id/payment')
  @ApiOkResponse({ type: Appointment })
  async updatePayment(
    @Param('id') id: string,
    @Body() paymentStatusDto: UpdatePaymentDto,
  ): Promise<Appointment> {
    const { status: paymentStatus, method: paymentMethod } = paymentStatusDto;
    return this.appointmentsService.updatePaymentStatus(
      id,
      paymentStatus,
      paymentMethod,
    );
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}

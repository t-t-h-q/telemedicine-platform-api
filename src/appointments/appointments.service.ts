import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { AppointmentRepository } from './infrastructure/persistence/appointment.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Appointment } from './domain/appointment';
import { PaymentMethod, PaymentStatus } from './enum/appointments.enum';

@Injectable()
export class AppointmentsService {
  constructor(
    // Dependencies here
    private readonly appointmentRepository: AppointmentRepository,
  ) {}

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const appointment = new Appointment();
    Object.assign(appointment, dto);
    return this.appointmentRepository.create(appointment);
  }

  async getAppointment(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    return appointment;
  }

  async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    return this.appointmentRepository.findByPatientId(patientId);
  }

  async getDoctorAppointments(doctorId: string): Promise<Appointment[]> {
    return this.appointmentRepository.findByDoctorId(doctorId);
  }

  async updateAppointmentStatus(
    id: string,
    status: string,
  ): Promise<Appointment> {
    const appointment = await this.getAppointment(id);
    appointment.status = status;
    return this.appointmentRepository.update(id, appointment);
  }

  async updatePaymentStatus(
    id: string,
    paymentStatus: PaymentStatus,
    paymentMethod: PaymentMethod,
  ): Promise<Appointment> {
    const appointment = await this.getAppointment(id);
    appointment.payment.status = paymentStatus;
    if (paymentMethod) {
      appointment.payment.method = paymentMethod;
    }
    return this.appointmentRepository.update(id, appointment);
  }

  async remove(id: string) {
    return this.appointmentRepository.remove(id);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.appointmentRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { TimeSlot } from './timeslot';
import { Payment } from './payment';
import { DoctorInfo } from './doctor-info';
import { PatientInfo } from './patient-info';

export class Appointment {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: () => DoctorInfo,
  })
  doctorInfo: DoctorInfo;

  @ApiProperty({
    type: PatientInfo,
  })
  patientInfo: PatientInfo;

  @ApiProperty({
    type: String,
  })
  service: string;

  @ApiProperty({
    type: Date,
  })
  appointmentDate: Date;

  @ApiProperty({
    type: () => TimeSlot,
  })
  timeSlot: TimeSlot;

  @ApiProperty({
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'failed'],
  })
  status: string;

  @ApiProperty({
    type: String,
  })
  notes: string;

  @ApiProperty({
    type: [String],
  })
  files: string[];

  @ApiProperty({
    type: Number,
  })
  cost: number;

  @ApiProperty({
    type: () => Payment,
  })
  payment: Payment;

  @ApiProperty({
    type: String,
  })
  currency: string;

  @ApiProperty({
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
  })
  updatedAt: Date;
}

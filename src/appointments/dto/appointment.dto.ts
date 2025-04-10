import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Payment } from '../domain/payment';
import { TimeSlot } from '../domain/timeslot';
import { DoctorInfo } from '../domain/doctor-info';
import { PatientInfo } from '../domain/patient-info';

export class AppointmentDto {
  @ApiProperty({
    description: 'The id of the appointment',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'The information of the patient',
    type: () => PatientInfo,
  })
  @IsNotEmpty()
  patientInfo: PatientInfo;

  @ApiProperty({
    description: 'The information of the doctor',
    type: () => DoctorInfo,
  })
  @IsNotEmpty()
  doctorInfo: DoctorInfo;

  @ApiProperty({
    description: 'The service provided during the appointment',
    example: 'General Consultation',
  })
  @IsNotEmpty()
  @IsString()
  service: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'The date and time of the appointment',
  })
  @IsNotEmpty()
  appointmentDate: Date;

  @ApiProperty({
    description: 'The time slot of the appointment',
    type: () => TimeSlot,
  })
  @IsNotEmpty()
  timeSlot: TimeSlot;

  @ApiProperty({
    description: 'The status of the appointment',
    example: 'confirmed',
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'failed'],
  })
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Additional notes for the appointment',
    example: 'Patient needs to fast for 12 hours before the appointment',
  })
  @IsString()
  notes: string;

  @ApiProperty({
    description: 'Files related to the appointment',
    example: ['file1.pdf', 'file2.jpg'],
  })
  @IsNotEmpty()
  @IsString({ each: true })
  files: string[];

  @ApiProperty({
    description: 'The cost of the appointment',
    example: 100,
  })
  @IsNotEmpty()
  cost: number;

  @ApiProperty({
    description: 'The payment details for the appointment',
    type: () => Payment,
  })
  @IsNotEmpty()
  payment: Payment;

  @ApiProperty({
    description: 'The currency used for the payment',
    example: 'VND',
  })
  @IsNotEmpty()
  @IsString()
  currency: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'The date and time when the appointment was created',
  })
  @IsNotEmpty()
  createdAt: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'The date and time when the appointment was last updated',
  })
  @IsNotEmpty()
  updatedAt: Date;
}

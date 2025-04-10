import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PatientInfo } from '../domain/patient-info';
import { DoctorInfo } from '../domain/doctor-info';

class TimeSlotDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  endTime: string;
}

class PaymentDto {
  @ApiProperty({ enum: ['credit_card', 'e-wallet', 'bank_transfer'] })
  @IsEnum(['credit_card', 'e-wallet', 'bank_transfer'])
  method: string;
}

export class CreateAppointmentDto {
  @ApiProperty({ type: PatientInfo })
  @ValidateNested()
  @Type(() => PatientInfo)
  patientInfo: PatientInfo;

  @ApiProperty({ type: DoctorInfo })
  @ValidateNested()
  @Type(() => DoctorInfo)
  doctorInfo: DoctorInfo;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  service: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  appointmentDate: Date;

  @ApiProperty({ type: TimeSlotDto })
  @ValidateNested()
  @Type(() => TimeSlotDto)
  timeSlot: TimeSlotDto;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ required: false })
  @IsString({ each: true })
  @IsOptional()
  files?: string[];

  @ApiProperty()
  @IsNumber()
  cost: number;

  @ApiProperty({ type: PaymentDto })
  @ValidateNested()
  @Type(() => PaymentDto)
  payment: PaymentDto;

  @ApiProperty({ required: true })
  @IsString()
  @IsOptional()
  currency?: string;
}

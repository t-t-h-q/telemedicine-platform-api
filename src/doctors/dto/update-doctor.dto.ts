import { PartialType } from '@nestjs/swagger';
import { CreateDoctorDto } from './create-doctor.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsArray,
  IsBoolean,
  ValidateNested,
  IsObject,
  Allow,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Availability } from '../domain/availability';
import { Location } from '../domain/location';

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {
  @ApiPropertyOptional({
    description: 'The user ID of the doctor',
    example: '12345',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Allow()
  userId?: string;

  @ApiPropertyOptional({
    description: 'List of professional documents',
    example: ['document1.pdf', 'document2.pdf'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Allow()
  professionalDocuments: string[];

  @ApiPropertyOptional({
    description: 'Approval status of the doctor',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  @Allow()
  approved: boolean;

  @ApiPropertyOptional({
    description: 'List of specialties',
    example: ['Cardiology', 'Neurology'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Allow()
  specialties: string[];

  @ApiPropertyOptional({
    description: 'List of languages spoken',
    example: ['English', 'Spanish'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Allow()
  languages: string[];

  @ApiPropertyOptional({
    description: 'The location of the doctor',
    type: Location,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Location)
  @Allow()
  location: Location;

  @ApiPropertyOptional({
    description: 'The availability of the doctor',
    type: [Availability],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Availability)
  @Allow()
  availability: Availability[];
}

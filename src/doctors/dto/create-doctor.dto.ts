import { ApiProperty } from '@nestjs/swagger';
import {
  // IsBoolean,
  IsString,
  IsArray,
  ValidateNested,
  IsObject,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Availability } from '../domain/availability';
import { Location } from '../domain/location';

export class CreateDoctorDto {
  @ApiProperty({
    description: 'The user ID of the doctor',
    example: '12345',
    type: String,
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'List of professional documents',
    example: ['document1.pdf', 'document2.pdf'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  professionalDocuments: string[];

  @ApiProperty({
    description: 'Approval status of the doctor',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean()
  approved: boolean;

  @ApiProperty({
    description: 'List of specialties',
    example: ['Cardiology', 'Neurology'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialties: string[];

  @ApiProperty({
    description: 'List of languages spoken',
    example: ['en', 'fr'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages: string[];

  @ApiProperty({
    description: 'The location of the doctor',
    type: Location,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Location)
  location: Location;

  @ApiProperty({
    description: 'The availability of the doctor',
    type: [Availability],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Availability)
  availability: Availability[];

  @ApiProperty()
  @IsOptional()
  createdAt: Date;

  @ApiProperty()
  @IsOptional()
  updatedAt: Date;
}

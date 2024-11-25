import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DoctorDto {
  @ApiProperty({
    description: 'The id of the user',
    example: '1',
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'The professional documents of the doctor',
    example: ['Medical License', 'Board Certification'],
  })
  @IsNotEmpty()
  @IsString({ each: true })
  professionalDocuments: string[];

  @ApiProperty({
    description: 'The specialties of the doctor',
    example: ['Cardiology', 'Dermatology'],
  })
  @IsNotEmpty()
  @IsString({ each: true })
  specialties: string[];

  @ApiProperty({
    description: 'The languages spoken by the doctor',
    example: ['en', 'fr'],
  })
  @IsNotEmpty()
  @IsString({ each: true })
  languages: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

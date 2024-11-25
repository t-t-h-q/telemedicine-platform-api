import { ApiProperty } from '@nestjs/swagger';
import { Availability } from './availability';
import { Location } from './location';
import { User } from '../../users/domain/user';

export class Doctor {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty({
    type: String,
  })
  userId: string;

  @ApiProperty({
    type: [String],
  })
  professionalDocuments: string[];

  @ApiProperty({
    type: Boolean,
  })
  approved: boolean;

  @ApiProperty({
    type: [String],
  })
  specialties: string[];

  @ApiProperty({
    type: [String],
  })
  languages: string[];

  @ApiProperty({
    type: () => Location,
  })
  location: Location;

  @ApiProperty({
    type: () => [Availability],
  })
  availability: Availability[];

  @ApiProperty({
    type: User,
    required: false,
  })
  userInfo?: User;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
  })
  updatedAt: Date;
}

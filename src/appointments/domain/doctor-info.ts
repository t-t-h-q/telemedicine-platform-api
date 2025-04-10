import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class DoctorInfo {
  @ApiProperty({
    type: String,
  })
  doctorId: string;

  @Allow()
  @ApiProperty({
    type: String,
  })
  firstName: string;

  @Allow()
  @ApiProperty({
    type: String,
  })
  lastName: string;

  @Allow()
  @ApiProperty({
    type: String,
  })
  email: string;

  @Allow()
  @ApiProperty({
    type: String,
  })
  phone: string;
}

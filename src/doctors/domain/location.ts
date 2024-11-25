import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class Location {
  @Allow()
  @ApiProperty({
    type: String,
    example: 'Sai Gon',
  })
  city: string;

  @Allow()
  @ApiProperty({
    type: String,
    example: '70000',
  })
  postalCode: string;
}

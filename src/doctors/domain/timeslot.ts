import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class TimeSlot {
  @Allow()
  @ApiProperty({
    type: String,
    example: '09:00',
  })
  startTime: string;

  @Allow()
  @ApiProperty({
    type: String,
    example: '10:00',
  })
  endTime: string;
}

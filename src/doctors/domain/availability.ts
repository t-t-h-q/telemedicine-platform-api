import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';
import { TimeSlot } from './timeslot';

export class Availability {
  @Allow()
  @ApiProperty({
    type: String,
    example: 'Monday',
  })
  dayOfWeek: string;

  @Allow()
  @ApiProperty({
    type: [TimeSlot],
  })
  timeSlots: TimeSlot[];
}

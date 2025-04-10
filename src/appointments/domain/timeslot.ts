import { ApiProperty } from '@nestjs/swagger';

export class TimeSlot {
  @ApiProperty({
    description: 'Start time of the time slot',
    example: '09:00',
    type: String,
  })
  startTime: string;

  @ApiProperty({
    description: 'End time of the time slot',
    example: '10:00',
    type: String,
  })
  endTime: string;

  constructor(startTime: string, endTime: string) {
    this.startTime = startTime;
    this.endTime = endTime;
  }
}

import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod, PaymentStatus } from '../enum/appointments.enum';

export class Payment {
  @ApiProperty({
    enum: PaymentMethod,
    description: 'Payment method',
    example: PaymentMethod.CREDIT_CARD,
  })
  method: string;

  @ApiProperty({
    enum: PaymentStatus,
    description: 'Payment status',
    example: PaymentStatus.PENDING,
  })
  status: string;
}

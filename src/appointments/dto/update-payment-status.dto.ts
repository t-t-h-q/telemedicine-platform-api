import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../enum/appointments.enum';

export class UpdatePaymentDto {
  @ApiProperty({
    enum: PaymentStatus,
    description: 'Payment status',
    example: PaymentStatus.PENDING,
  })
  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({
    description: 'Payment method',
    example: PaymentMethod.BANK_TRANSFER,
  })
  method: PaymentMethod;
}

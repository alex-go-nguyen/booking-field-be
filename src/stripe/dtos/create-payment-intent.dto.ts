import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreatePaymentIntentDto {
  @ApiProperty()
  @IsString()
  currency: string;

  @ApiProperty()
  @Type(() => Number)
  amount: number;
}

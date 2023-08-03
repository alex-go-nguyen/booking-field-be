import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty()
  startTime: Date;

  @ApiProperty()
  endTime: Date;

  @ApiProperty()
  @IsNumber()
  user: number;

  @ApiProperty()
  @IsNumber()
  pitch: number;
}

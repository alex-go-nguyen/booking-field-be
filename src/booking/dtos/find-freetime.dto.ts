import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNumberString, IsOptional, IsString } from 'class-validator';

export class FindBookingFreeTimeDto {
  @ApiProperty()
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  pitchId: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreatePitchDto {
  @ApiProperty()
  @IsNumber()
  no: number;

  @ApiProperty()
  @IsNumber()
  pitchCategory: number;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  venue: number;
}

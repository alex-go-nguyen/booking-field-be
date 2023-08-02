import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty()
  @IsNumber()
  booking: number;

  @IsString()
  @ApiProperty()
  content: string;

  @IsNumber()
  @ApiProperty()
  rate: number;
}

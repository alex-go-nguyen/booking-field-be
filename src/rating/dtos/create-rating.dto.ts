import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateRatingDto {
  @ApiProperty()
  @IsNumber()
  booking: number;

  @IsString()
  @ApiProperty()
  content: string;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  qualityRate: number;

  @ApiProperty({
    type: Number,
  })
  @IsNumber()
  serviceRate: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
  @Type(() => Number)
  rate: number;
}

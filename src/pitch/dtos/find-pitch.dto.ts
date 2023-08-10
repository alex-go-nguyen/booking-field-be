import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class FindPitchQueryDto {
  @ApiProperty()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  pitchCategoryId: number;
}

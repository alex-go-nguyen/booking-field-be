import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { BaseQuery } from 'src/common/dtos/query.dto';

export class PitchQuery extends BaseQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pitchCategoryId: number;

  @ApiPropertyOptional()
  @IsOptional()
  maxPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  minPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  location: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  venueId: number;
}

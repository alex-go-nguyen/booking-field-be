import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { BaseQuery } from 'src/common/dtos/query.dto';

export class SearchListVenueQuery extends BaseQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pitchCategory: number;

  @ApiPropertyOptional()
  @IsOptional()
  location: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pitch_type: string;

  @ApiPropertyOptional()
  @IsOptional()
  maxPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  minPrice: number;
}

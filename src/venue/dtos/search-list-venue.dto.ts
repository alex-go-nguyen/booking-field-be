import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { BaseQuery } from 'src/common/dtos/query.dto';

export class SearchVenuesQuery extends BaseQuery {
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
  maxPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  minPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  currentLat: number;

  @ApiPropertyOptional()
  @IsOptional()
  currentLng: number;

  @ApiPropertyOptional()
  @IsOptional()
  maxDistance: number;

  @ApiPropertyOptional()
  @IsOptional()
  isProminant: boolean;
}

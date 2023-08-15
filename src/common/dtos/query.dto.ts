import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { IPagination } from './pagination.dto';
import { ISortQuery } from './sort.dto';

export class IBaseQuery extends IPagination {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  sorts?: ISortQuery[];
}

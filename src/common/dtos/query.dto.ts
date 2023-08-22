import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { Pagination } from './pagination.dto';
import { SortQuery } from './sort.dto';

export class BaseQuery extends Pagination {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  sorts?: SortQuery[];
}

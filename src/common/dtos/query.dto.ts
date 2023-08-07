import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { IPagination } from './pagination.dto';

export class IQuery extends IPagination {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  keyword: string;
}

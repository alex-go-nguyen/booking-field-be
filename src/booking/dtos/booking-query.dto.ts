import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional } from 'class-validator';
import { BaseQuery } from 'src/common/dtos/query.dto';

export class BookingQuery extends BaseQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pitchId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  date: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  venueId: number;
}

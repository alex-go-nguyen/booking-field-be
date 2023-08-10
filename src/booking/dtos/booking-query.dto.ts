import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional } from 'class-validator';
import { IBaseQuery } from 'src/common/dtos/query.dto';

export class IBookingQuery extends IBaseQuery {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pitchId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  date: Date;
}

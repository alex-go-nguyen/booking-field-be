import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { BaseQuery } from 'src/common/dtos/query.dto';
import { VenueStatusEnum } from '../enums/venue.enum';

export class VenueQuery extends BaseQuery {
  @ApiPropertyOptional()
  @IsOptional()
  userId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(VenueStatusEnum)
  status: VenueStatusEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keyword: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isProminant: boolean;
}

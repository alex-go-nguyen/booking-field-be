import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';
import { IQuery } from 'src/common/dtos/query.dto';

export class IVenueQuery extends IQuery {
  @ApiPropertyOptional()
  @IsOptional()
  location: string;

  @ApiPropertyOptional()
  @IsOptional()
  pitch_type: string;

  @ApiPropertyOptional()
  @IsOptional()
  sort: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  maxPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  minPrice: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { IQuery } from 'src/common/dtos/query.dto';

export class ISearchListVenueQuery extends IQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pitchCategory: number;

  @ApiProperty({ required: false })
  @IsOptional()
  location: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  pitch_type: string;

  @ApiProperty({ required: false })
  @IsOptional()
  sort: number;

  @ApiProperty({ required: false })
  @IsOptional()
  maxPrice: number;

  @ApiProperty({ required: false })
  @IsOptional()
  minPrice: number;
}

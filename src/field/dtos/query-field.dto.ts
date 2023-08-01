import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsOptional } from 'class-validator';
import { IQuery } from 'src/common/dtos/query.dto';

export class IFieldQuery extends IQuery {
  @ApiProperty({ required: false })
  @IsOptional()
  location: string;

  @ApiProperty({ required: false })
  @IsOptional()
  field_type: string;

  @ApiProperty({ required: false })
  @IsOptional()
  sort: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  maxPrice: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  minPrice: number;
}

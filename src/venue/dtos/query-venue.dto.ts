import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { BaseQuery } from 'src/common/dtos/query.dto';

export class VenueQuery extends BaseQuery {
  @ApiPropertyOptional()
  @IsOptional()
  location: string;
}

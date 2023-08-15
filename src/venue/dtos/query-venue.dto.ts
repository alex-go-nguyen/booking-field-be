import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IBaseQuery } from 'src/common/dtos/query.dto';

export class IVenueQuery extends IBaseQuery {
  @ApiPropertyOptional()
  @IsOptional()
  location: string;
}

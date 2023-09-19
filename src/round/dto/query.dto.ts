import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { BaseQuery } from 'src/common/dtos/query.dto';

export class GetRoundsQuery extends BaseQuery {
  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  tournamentId?: number;
}

import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { CreateMatchDto } from './create-match.dto';

export class UpdateMatchDto extends PartialType(CreateMatchDto) {
  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  hostGoals: number;

  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  guestGoals: number;
}

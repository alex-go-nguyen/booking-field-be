import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { RoleEnum } from 'src/common/enums/role.enum';

export class AnalystUserQuery {
  @ApiPropertyOptional()
  @IsInt()
  @Type(() => Number)
  year: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum;
}

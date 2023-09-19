import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ModeEnum, TournamentTypeEnum } from '../enums/tournament.enum';

export class CreateTournamentDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cover: string;

  @ApiProperty()
  @IsEnum(ModeEnum)
  mode: ModeEnum;

  @ApiProperty()
  @IsEnum(TournamentTypeEnum)
  type: TournamentTypeEnum;

  @ApiProperty()
  @IsInt()
  totalTeam: number;

  @ApiProperty()
  @IsInt()
  venue: number;
}

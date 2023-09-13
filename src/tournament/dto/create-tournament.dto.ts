import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString } from 'class-validator';
import { ModeEnum, TournamentTypeEnum } from '../enums/tournament.enum';

export class CreateTournamentDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
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

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsString } from 'class-validator';
import { ModeEnum } from 'src/common/enums/mode.enum';
import { TournamentTypeEnum } from 'src/common/enums/tournament.enum';

export class CreateTournamentDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  phone: string;

  @ApiProperty({
    type: 'enum',
    enum: ModeEnum,
  })
  @IsEnum(ModeEnum)
  mode: ModeEnum;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  venue: number;

  @ApiProperty({
    type: 'enum',
    enum: TournamentTypeEnum,
  })
  @IsEnum(TournamentTypeEnum)
  type: TournamentTypeEnum;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  totalTeams: number;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  totalLineup: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateMatchDto {
  @ApiProperty()
  @IsInt()
  host: number;

  @ApiProperty()
  @IsInt()
  guest: number;

  @ApiProperty()
  time: Date;

  @ApiProperty()
  @IsInt()
  hostGoals: number;

  @ApiProperty()
  @IsInt()
  guestGoals: number;

  @ApiProperty()
  @IsInt()
  round: number;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class CreateRoundDto {
  @ApiProperty()
  @IsInt()
  no: number;

  @ApiProperty()
  @IsInt()
  tournament: number;
}

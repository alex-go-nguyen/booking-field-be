import { ApiProperty } from '@nestjs/swagger';
import { Team } from 'src/team/entities/team.entity';

export class CreateMatchDto {
  @ApiProperty()
  hostId: Team;

  @ApiProperty()
  guest: Team;

  @ApiProperty()
  time: Date;
}

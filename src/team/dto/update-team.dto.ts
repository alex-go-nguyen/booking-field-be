import { PartialType } from '@nestjs/swagger';
import { Team } from '../entities/team.entity';

export class UpdateTeamDto extends PartialType(Team) {}

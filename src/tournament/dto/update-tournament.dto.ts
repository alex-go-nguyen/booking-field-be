import { PartialType } from '@nestjs/swagger';
import { Tournament } from '../entities/tournament.entity';

export class UpdateTournamentDto extends PartialType(Tournament) {}

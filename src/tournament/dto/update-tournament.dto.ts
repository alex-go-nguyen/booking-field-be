import { PartialType } from '@nestjs/swagger';
import { Tournament } from '../entities/tournament.entity';
import { CreateTournamentDto } from './create-tournament.dto';

export class UpdateTournamentDto extends PartialType(Tournament) {}

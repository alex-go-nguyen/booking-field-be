import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { Tournament } from './entities/tournament.entity';

@Injectable()
export class TournamentService extends BaseService<Tournament, unknown> {
  constructor(@InjectRepository(Tournament) tournamentRepository: Repository<Tournament>) {
    super(tournamentRepository);
  }
}

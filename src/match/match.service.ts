import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { Match } from './entities/match.entity';

@Injectable()
export class MatchService extends BaseService<Match, unknown> {
  constructor(@InjectRepository(Match) private matchRepository: Repository<Match>) {
    super(matchRepository);
  }
}

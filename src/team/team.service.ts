import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamService extends BaseService<Team, unknown> {
  constructor(@InjectRepository(Team) private readonly teamRepository: Repository<Team>) {
    super(teamRepository);
  }
}

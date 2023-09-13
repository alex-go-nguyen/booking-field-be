import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamService extends BaseService<Team, unknown> {
  constructor(@InjectRepository(Team) teamRepository: Repository<Team>) {
    super(teamRepository);
  }

  createTeams(totalTeam: number, tournamentId: number) {
    const teamCreationPromises = Array.from(Array(totalTeam).keys()).map((index) =>
      this.create({ name: `${index + 1}`, tournament: tournamentId }),
    );

    return Promise.all(teamCreationPromises);
  }
}

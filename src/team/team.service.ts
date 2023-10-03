import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { GetTeamsQuery } from './dto/query.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamService extends BaseService<Team, unknown> {
  constructor(@InjectRepository(Team) teamRepository: Repository<Team>) {
    super(teamRepository);
  }

  findAllTeams(query: GetTeamsQuery) {
    const { tournamentId } = query;
    return this.findAndCount(query, {
      where: {
        tournament: {
          id: tournamentId,
        },
      },
    });
  }

  findById(id: number) {
    return this.findOne({ where: { id } });
  }

  async createTeams(totalTeam: number, tournamentId: number) {
    const teams = [];
    for (const index of Array.from(Array(totalTeam).keys())) {
      const data = await this.create({ name: `${index + 1}`, tournament: tournamentId });

      teams.push(data);
    }

    return teams;
  }
}

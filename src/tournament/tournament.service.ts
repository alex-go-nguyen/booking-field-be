import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseQuery } from 'src/common/dtos/query.dto';
import { OrderEnum } from 'src/common/enums/order.enum';
import { BaseService } from 'src/common/services/base.service';
import { createTournament } from 'src/common/utils';
import { MatchService } from 'src/match/match.service';
import { RoundService } from 'src/round/round.service';
import { TeamService } from 'src/team/team.service';
import { Repository } from 'typeorm';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { Tournament } from './entities/tournament.entity';
import { TournamentTypeEnum } from './enums/tournament.enum';

@Injectable()
export class TournamentService extends BaseService<Tournament, unknown> {
  constructor(
    @InjectRepository(Tournament) tournamentRepository: Repository<Tournament>,
    private readonly teamService: TeamService,
    private readonly roundService: RoundService,
    private readonly matchService: MatchService,
  ) {
    super(tournamentRepository);
  }

  findAllTournaments(query: BaseQuery) {
    return this.findAndCount(query, {
      order: {
        rounds: {
          matches: {
            id: OrderEnum.Asc,
          },
        },
      },
      relations: {
        teams: true,
        rounds: {
          matches: {
            host: true,
            guest: true,
          },
        },
        user: true,
        venue: true,
        pitchCategory: true,
      },
    });
  }

  findByCurrentUser(query: BaseQuery, userId: number) {
    return this.findAndCount(query, {
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        rounds: {
          matches: {
            id: OrderEnum.Asc,
          },
        },
      },
      relations: {
        teams: true,
        rounds: {
          matches: {
            host: true,
            guest: true,
          },
        },
        user: true,
        venue: true,
        pitchCategory: true,
      },
    });
  }

  findById(id: number) {
    return this.findOne({
      where: { id },
      relations: {
        teams: true,
        rounds: {
          matches: {
            host: true,
            guest: true,
          },
        },
        user: true,
        venue: true,
        pitchCategory: true,
      },
      order: {
        rounds: {
          matches: {
            id: OrderEnum.Asc,
          },
        },
      },
    });
  }

  async createTournament(createTournamentDto: CreateTournamentDto, userId: number) {
    const data = await this.create({ ...createTournamentDto, user: userId });

    const tournm = createTournament(data.totalTeam, data.type);

    const teams = await this.teamService.createTeams(data.totalTeam, data.id);

    teams.sort((a, b) => a.id - b.id);

    if (data.type === TournamentTypeEnum.RoundRobin) {
      const totalRounds = data.totalTeam % 2 === 0 ? data.totalTeam - 1 : data.totalTeam;

      const totalMatchesPerRound = (data.totalTeam * (data.totalTeam - 1)) / (2 * totalRounds);

      // let totalTeams = teams.length;
      // if (data.totalTeam % 2 !== 0) {
      //   teams.push(null); // Thêm đội "BYE" nếu số đội là số lẻ
      //   totalTeams++;
      // }

      for (let round = 0; round < totalRounds; round++) {
        const newRound = await this.roundService.create({ no: round, tournament: data.id });

        for (let i = 0; i < totalMatchesPerRound; i++) {
          const host = teams[i];
          const guest = teams[data.totalTeam - 1 - i];

          // if (host !== null && guest !== null) {
          await this.matchService.create({ round: newRound.id, host, guest });
          // }
        }
        teams.splice(1, 0, teams.pop());
      }
    }

    if (data.type === TournamentTypeEnum.Knockout) {
      for (let index = 0; index < tournm.length; index++) {
        const round = tournm[index];

        const newRound = await this.roundService.create({ no: round.round, tournament: data.id });

        const totalTeamsPreRound = tournm.slice(0, index).reduce((count, item) => count + item.matches.length * 2, 0);

        for (let index = 0; index < round.matches.length; index++) {
          const currentMatchIndex = totalTeamsPreRound / 2 + index;
          if (teams.length > totalTeamsPreRound + index) {
            await this.matchService.create({
              round: newRound.id,
              ...(currentMatchIndex * 2 <= teams.length && { host: teams[currentMatchIndex * 2] }),
              ...(currentMatchIndex * 2 + 1 <= teams.length && { guest: teams[currentMatchIndex * 2 + 1] }),
            });
          } else {
            await this.matchService.create({
              round: newRound.id,
            });
          }
        }
      }
    }

    return data;
  }
}

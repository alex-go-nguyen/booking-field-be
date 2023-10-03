import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEnum } from 'src/common/enums/order.enum';
import { BaseService } from 'src/common/services/base.service';
import { TeamService } from 'src/team/team.service';
import { TournamentTypeEnum } from 'src/tournament/enums/tournament.enum';
import { IsNull, Repository } from 'typeorm';
import { GetMatchesQuery } from './dto/match-query.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Match } from './entities/match.entity';

@Injectable()
export class MatchService extends BaseService<Match, unknown> {
  constructor(@InjectRepository(Match) matchRepository: Repository<Match>, private readonly teamService: TeamService) {
    super(matchRepository);
  }

  async findAllMatches(query: GetMatchesQuery) {
    const { tournamentId } = query;

    return this.findAndCount(query, {
      where: {
        ...(tournamentId && {
          round: {
            tournament: {
              id: tournamentId,
            },
          },
        }),
      },
      relations: {
        host: true,
        guest: true,
        round: true,
      },
      order: {
        round: {
          id: OrderEnum.Asc,
          matches: {
            id: OrderEnum.Asc,
          },
        },
      },
    });
  }

  findById(id: number) {
    return this.findOne({
      where: { id },
      relations: {
        host: true,
        guest: true,
        round: {
          tournament: true,
        },
      },
    });
  }

  async updateMatch(id: number, updateMatchDto: UpdateMatchDto) {
    await this.update(id, updateMatchDto);

    const data = await this.findById(id);

    if (updateMatchDto.hostGoals && updateMatchDto.guestGoals) {
      let resultMatch: string;
      if (data.hostGoals === data.guestGoals) {
        resultMatch = 'draw';
      } else {
        resultMatch = data.hostGoals > data.guestGoals ? 'host' : 'guest';
      }

      this.teamService.update(data.host.id, {
        matchesPlayed: data.host.matchesPlayed + 1,
        ...(resultMatch === 'host' && { win: data.host.win + 1, point: data.host.point + 3 }),
        ...(resultMatch === 'guest' && { lose: data.host.lose + 1 }),
        ...(resultMatch === 'draw' && {
          draw: data.host.draw + 1,
          point: data.host.point + 1,
        }),
      });
      this.teamService.update(data.guest.id, {
        matchesPlayed: data.guest.matchesPlayed + 1,
        ...(resultMatch === 'guest' && { win: data.guest.win + 1, point: data.guest.point + 3 }),
        ...(resultMatch === 'host' && { lose: data.guest.lose + 1 }),
        ...(resultMatch === 'draw' && {
          draw: data.guest.draw + 1,
          point: data.guest.point + 1,
        }),
      });

      if (data.round.tournament.type === TournamentTypeEnum.Knockout) {
        const match = await this.findOne({
          where: [
            {
              round: {
                tournament: {
                  id: data.round.tournament.id,
                },
              },
              host: IsNull(),
            },
            {
              round: {
                tournament: {
                  id: data.round.tournament.id,
                },
              },
              guest: IsNull(),
            },
          ],
          relations: {
            host: true,
            guest: true,
          },
        });

        const winTeam = resultMatch === 'host' ? data.host : data.guest;

        match &&
          this.update(match.id, {
            ...(!match.host ? { host: winTeam } : { guest: winTeam }),
          });
      }
    }

    return data;
  }
}

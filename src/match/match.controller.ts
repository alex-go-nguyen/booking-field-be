import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { OrderEnum } from 'src/common/enums/order.enum';
import { TeamService } from 'src/team/team.service';
import { TournamentTypeEnum } from 'src/tournament/enums/tournament.enum';
import { IsNull } from 'typeorm';
import { CreateMatchDto } from './dto/create-match.dto';
import { GetMatchesQuery } from './dto/match-query.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { MatchService } from './match.service';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService, private readonly teamService: TeamService) {}

  @Get()
  findAll(@Query() query: GetMatchesQuery) {
    const { tournamentId } = query;
    return this.matchService.findAndCount(query, {
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

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.matchService.findOne({
      where: { id },
      relations: {
        host: true,
        guest: true,
        round: {
          tournament: true,
        },
      },
    });
    return { data };
  }

  @Post()
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchService.create(createMatchDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateMatchDto: UpdateMatchDto) {
    await this.matchService.update(id, updateMatchDto);

    const { data } = await this.findOne(id);

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
        const match = await this.matchService.findOne({
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
          this.matchService.update(match.id, {
            ...(!match.host ? { host: winTeam } : { guest: winTeam }),
          });
      }
    }

    return { data };
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.matchService.softDelete(id);
  }
}

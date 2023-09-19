import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { BaseQuery } from 'src/common/dtos/query.dto';
import { OrderEnum } from 'src/common/enums/order.enum';
import { createTournament } from 'src/common/utils';
import { MatchService } from 'src/match/match.service';
import { RoundService } from 'src/round/round.service';
import { TeamService } from 'src/team/team.service';
import { CurrentUser } from 'src/user/user.decorator';
import { CreateTournamentDto } from './dto/create-tournament.dto';
import { UpdateTournamentDto } from './dto/update-tournament.dto';
import { TournamentService } from './tournament.service';

@ApiTags('Tournament')
@Controller('tournaments')
export class TournamentController {
  constructor(
    private readonly tournamentService: TournamentService,
    private readonly roundService: RoundService,
    private readonly matchService: MatchService,
    private readonly teamService: TeamService,
  ) {}

  @Get()
  findAll(@Query() query: BaseQuery) {
    return this.tournamentService.findAndCount(query, {
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
      },
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.tournamentService.findOne({
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
      },
    });

    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTournamentDto: CreateTournamentDto, @CurrentUser('id') userId: number) {
    const data = await this.tournamentService.create({ ...createTournamentDto, user: userId });

    const tournm = createTournament(data.totalTeam, data.type);

    const teams = await this.teamService.createTeams(data.totalTeam, data.id);

    teams.sort((a, b) => a.id - b.id);

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

    return { data };
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateTournamentDto: UpdateTournamentDto) {
    const data = await this.tournamentService.update(id, updateTournamentDto);

    return { data };
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.tournamentService.softDelete(id);
  }
}

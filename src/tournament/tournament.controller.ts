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
import { TournamentTypeEnum } from './enums/tournament.enum';
import { TournamentService } from './tournament.service';

@ApiTags('Tournament')
@Controller('tournaments')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get()
  findAll(@Query() query: BaseQuery) {
    return this.tournamentService.findAllTournaments(query);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findByCurrentUser(@Query() query: BaseQuery, @CurrentUser('id') userId: number) {
    return this.tournamentService.findByCurrentUser(query, userId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.tournamentService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTournamentDto: CreateTournamentDto, @CurrentUser('id') userId: number) {
    return this.tournamentService.createTournament(createTournamentDto, userId);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateTournamentDto: UpdateTournamentDto) {
    return this.tournamentService.update(id, updateTournamentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.tournamentService.softDelete(id);
  }
}

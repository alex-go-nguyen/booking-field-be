import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { GetTeamsQuery } from './dto/query.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { TeamService } from './team.service';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  findAll(@Query() query: GetTeamsQuery) {
    const { tournamentId } = query;
    return this.teamService.findAndCount(query, {
      where: {
        tournament: {
          id: tournamentId,
        },
      },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.teamService.findOne({ where: { id } });
  }

  @Post()
  async create(@Body() createTeamDto: CreateTeamDto) {
    const data = await this.teamService.create(createTeamDto);

    return { data };
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateTeamDto: UpdateTeamDto) {
    return this.teamService.update(id, updateTeamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.teamService.softDelete(id);
  }
}

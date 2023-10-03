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
    return this.teamService.findAllTeams(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.teamService.findById(id);
  }

  @Post()
  create(@Body() createTeamDto: CreateTeamDto) {
    return this.teamService.create(createTeamDto);
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

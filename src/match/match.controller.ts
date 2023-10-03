import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { GetMatchesQuery } from './dto/match-query.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { MatchService } from './match.service';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  findAll(@Query() query: GetMatchesQuery) {
    return this.matchService.findAllMatches(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.matchService.findById(id);
  }

  @Post()
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchService.create(createMatchDto);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchService.updateMatch(id, updateMatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.matchService.softDelete(id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CreateRoundDto } from './dto/create-round.dto';
import { GetRoundsQuery } from './dto/query.dto';
import { UpdateRoundDto } from './dto/update-round.dto';
import { RoundService } from './round.service';

@Controller('rounds')
export class RoundController {
  constructor(private readonly roundService: RoundService) {}

  @Post()
  create(@Body() createRoundDto: CreateRoundDto) {
    return this.roundService.create(createRoundDto);
  }

  @Get()
  findAll(@Query() query: GetRoundsQuery) {
    const { tournamentId } = query;
    return this.roundService.findAndCount(query, {
      where: {
        ...(tournamentId && {
          tournament: {
            id: tournamentId,
          },
        }),
      },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.roundService.findOne({ where: { id } });
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRoundDto: UpdateRoundDto) {
    return this.roundService.update(+id, updateRoundDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.roundService.softDelete(id);
  }
}

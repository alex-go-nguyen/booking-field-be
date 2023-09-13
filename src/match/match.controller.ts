import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { IsNull } from 'typeorm';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { MatchService } from './match.service';

@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  findAll() {
    return this.matchService.findAll();
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

    const winTeam = data.hostGoals > data.guestGoals ? data.host : data.guest;

    match &&
      this.matchService.update(match.id, {
        ...(!match.host ? { host: winTeam } : { guest: winTeam }),
      });

    return { data };
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.matchService.softDelete(id);
  }
}

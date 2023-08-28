import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { BaseResponse } from 'src/common/dtos/base.dto';
import { BaseQuery } from 'src/common/dtos/query.dto';
import { CurrentUser } from 'src/user/user.decorator';
import { CreateTournamentDto } from './dtos/create-tournament.dto';
import { UpdateTournamentDto } from './dtos/update-tournament.dto';
import { Tournament } from './entities/tournament.entity';
import { TournamentService } from './tournament.service';

@Controller('tournaments')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get()
  findAll(@Query() query: BaseQuery) {
    return this.tournamentService.findAndCount(query, {
      relations: {
        venue: true,
        user: true,
      },
    });
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.tournamentService.findOne({
      where: {
        _id: id,
      },
      relations: {
        venue: true,
        user: true,
      },
    });
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create tournament successfully',
    type: BaseResponse<Tournament>,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTournamentDto: CreateTournamentDto, @CurrentUser('_id') userId: number) {
    const data = await this.tournamentService.create({ ...createTournamentDto, user: userId });

    return { data };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update tournament successfully',
    type: BaseResponse<Tournament>,
  })
  @ResponseMessage('Update tournament successfully')
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateTournamentDto: UpdateTournamentDto) {
    const data = await this.tournamentService.update(id, updateTournamentDto);

    return { data };
  }

  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    this.tournamentService.softDelete(id);
  }
}

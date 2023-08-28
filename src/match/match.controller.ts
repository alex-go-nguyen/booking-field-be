import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { BaseQuery } from 'src/common/dtos/query.dto';
import { CreateMatchDto } from './dtos/create-match.dto';
import { UpdateMatchDto } from './dtos/update-match.dto';
import { Match } from './entities/match.entity';
import { MatchService } from './match.service';
@Controller('matches')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @ApiOkResponse({
    description: 'Get all successfully!',
    type: [Match],
  })
  @ResponseMessage('Get all successfully')
  @Get()
  findAll(@Query() query: BaseQuery) {
    return this.matchService.findAndCount(query);
  }

  @ApiOkResponse({
    description: 'Get match successfully!',
    type: Match,
  })
  @ResponseMessage('Get match successfully')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.matchService.findOne({
      where: {
        _id: id,
      },
    });

    return { data };
  }

  @ApiOkResponse({
    description: 'Create match successfully!',
    type: Match,
  })
  @ResponseMessage('Create match successfully')
  @Post()
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchService.create(createMatchDto);
  }

  @ApiOkResponse({
    description: 'Update match successfully!',
    type: Match,
  })
  @ResponseMessage('Update match successfully')
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateMatchDto: UpdateMatchDto) {
    const data = await this.matchService.update(id, updateMatchDto);

    return { data };
  }

  @ApiOkResponse({
    description: 'Delete match successfully!',
  })
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.matchService.softDelete(id);
  }
}

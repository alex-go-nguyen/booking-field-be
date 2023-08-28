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
import { CreateTeamDto } from './dtos/create-team.dto';
import { UpdateTeamDto } from './dtos/update-team.dto';
import { Team } from './entities/team.entity';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  findAll(@Query() query: BaseQuery) {
    return this.teamService.findAndCount(query, {});
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.teamService.findOne({
      where: {
        _id: id,
      },
    });
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create team successfully',
    type: BaseResponse<Team>,
  })
  @Post()
  async create(@Body() createTeamDto: CreateTeamDto) {
    const data = await this.create(createTeamDto);

    return { data };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update team successfully',
    type: BaseResponse<Team>,
  })
  @ResponseMessage('Update team successfully')
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateTeamDto: UpdateTeamDto) {
    const data = await this.teamService.update(id, updateTeamDto);

    return { data };
  }

  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    this.teamService.softDelete(id);
  }
}

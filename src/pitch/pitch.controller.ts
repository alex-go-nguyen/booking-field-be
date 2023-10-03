import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/auth/roles.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { BasePaginationResponse, BaseResponse } from 'src/common/dtos/base.dto';
import { RoleEnum } from 'src/common/enums/role.enum';
import { SearchService } from 'src/search/search.service';
import { VenueSearchBody } from 'src/venue/interfaces/venue-search.interface';
import { Between, In } from 'typeorm';
import { CreatePitchDto } from './dtos/create-pitch.dto';
import { PitchQuery } from './dtos/pitch-query.dto';
import { UpdatePitchDto } from './dtos/update-pitch.dto';
import { Pitch } from './entities/pitch.entity';
import { PitchService } from './pitch.service';

@ApiTags('Pitch')
@Controller('pitches')
export class PitchController {
  constructor(private readonly pitchService: PitchService, private readonly searchService: SearchService) {}

  @ApiOkResponse({
    description: 'Get all pitches successfully!',
    type: BasePaginationResponse<Pitch>,
  })
  @ResponseMessage('Get all pitches successfully')
  @Get()
  findAll(@Query() query: PitchQuery) {
    return this.pitchService.findAllPitches(query);
  }

  @ApiOkResponse({
    description: 'Get pitch successfully!',
    type: BaseResponse<Pitch>,
  })
  @ResponseMessage('Get pitch successfully')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.pitchService.findById(id);
  }

  @ApiOkResponse({
    description: 'Create pitch successfully!',
    type: BaseResponse<Pitch>,
  })
  @ResponseMessage('Create pitch successfully')
  @Roles(RoleEnum.Owner, RoleEnum.Admin)
  @UseGuards(RoleGuard)
  @Post()
  create(@Body() createPitchDto: CreatePitchDto) {
    return this.pitchService.create(createPitchDto);
  }

  @ApiOkResponse({
    description: 'Update pitch successfully!',
    type: BaseResponse<Pitch>,
  })
  @ResponseMessage('Update pitch successfully')
  @Roles(RoleEnum.Owner, RoleEnum.Admin)
  @UseGuards(RoleGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() updatePitchDto: UpdatePitchDto) {
    return this.pitchService.update(id, updatePitchDto);
  }

  @ApiOkResponse({
    description: 'Delete pitch successfully!',
  })
  @Roles(RoleEnum.Owner, RoleEnum.Admin)
  @UseGuards(RoleGuard)
  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.pitchService.softDelete(id);
  }
}

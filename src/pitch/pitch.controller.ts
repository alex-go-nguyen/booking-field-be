import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
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
    type: [Pitch],
  })
  @ResponseMessage('Get all pitches successfully')
  @Get()
  async findAll(@Query() query: PitchQuery) {
    const { page, limit, pitchCategoryId, venueId, minPrice, maxPrice, location, sorts } = query;

    let ids: number[] = [];
    if (location) {
      ids = await this.searchService.search<VenueSearchBody>('venues', location, [
        'name',
        'description',
        'district',
        'province',
      ]);
    }

    return this.pitchService.findAndCount(
      { page, limit, sorts },
      {
        where: {
          ...(minPrice &&
            maxPrice && {
              price: Between(minPrice, maxPrice),
            }),
          ...(pitchCategoryId && {
            pitchCategory: {
              id: pitchCategoryId,
            },
          }),
          ...(location && {
            venue: {
              id: In(ids),
            },
          }),
          ...(venueId && {
            venue: {
              id: venueId,
            },
          }),
        },
        relations: {
          pitchCategory: true,
          venue: true,
        },
      },
    );
  }

  @ApiOkResponse({
    description: 'Get pitch successfully!',
    type: Pitch,
  })
  @ResponseMessage('Get pitch successfully')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.pitchService.findOne({
      where: {
        id,
      },
    });

    return { data };
  }

  @ApiOkResponse({
    description: 'Create pitch successfully!',
    type: Pitch,
  })
  @ResponseMessage('Create pitch successfully')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.Owner, RoleEnum.Admin)
  @Post()
  create(@Body() createPitchDto: CreatePitchDto) {
    return this.pitchService.create(createPitchDto);
  }

  @ApiOkResponse({
    description: 'Update pitch successfully!',
    type: Pitch,
  })
  @ResponseMessage('Update pitch successfully')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.Owner, RoleEnum.Admin)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updatePitchDto: UpdatePitchDto) {
    const data = await this.pitchService.update(id, updatePitchDto);

    return { data };
  }

  @ApiOkResponse({
    description: 'Delete pitch successfully!',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.Owner, RoleEnum.Admin)
  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.pitchService.softDelete(id);
  }
}

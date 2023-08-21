import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ERole } from 'src/common/enums/role.enum';
import { SearchService } from 'src/search/search.service';
import { VenueSearchBody } from 'src/venue/interfaces/venue-search.interface';
import { Between, In } from 'typeorm';
import { CreatePitchDto } from './dtos/create-pitch.dto';
import { FindPitchQueryDto } from './dtos/find-pitch.dto';
import { IPitchQuery } from './dtos/pitch-query.dto';
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
  async findAll(@Query() query: IPitchQuery) {
    const { page, limit, pitchCategoryId, minPrice, maxPrice, location, sorts } = query;

    let ids: number[] = [];
    if (location) {
      ids = await this.searchService.search<VenueSearchBody>('venues', location, [
        'name',
        'description',
        'district',
        'province',
      ]);
    }

    return this.pitchService.findMany(
      { page, limit, sorts },
      {
        where: {
          price: minPrice && maxPrice && Between(minPrice, maxPrice),
          pitchCategory: {
            _id: pitchCategoryId && pitchCategoryId,
          },
          venue: {
            _id: location && In(ids),
          },
        },
        relations: {
          pitchCategory: true,
          venue: true,
        },
      },
    );
  }

  @ApiOkResponse({
    description: 'Get all pitch by venue detail page successfully!',
    type: [Pitch],
  })
  @ResponseMessage('Get pitch by venue detail page successfully')
  @Get('venue-detail/:venueId')
  async findInVenueDetail(@Param('venueId') venueId: number) {
    const data = await this.pitchService.findInVenueDetail(venueId);

    return { data };
  }

  @ApiOkResponse({
    description: 'Get pitches by venue successfully!',
    type: [Pitch],
  })
  @ResponseMessage('Get pitches by venue successfully')
  @Get('venue/:venueId')
  async findByVenue(@Param('venueId') venueId: number, @Query() query: FindPitchQueryDto) {
    const relations = ['venue', 'pitchCategory'];

    const { pitchCategoryId } = query;

    const data = await this.pitchService.findAll({
      where: {
        venue: {
          _id: venueId,
        },
        pitchCategory: {
          _id: pitchCategoryId,
        },
      },
      relations,
    });

    return { data };
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
        _id: id,
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
  @Roles(ERole.Owner, ERole.Admin)
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
  @Roles(ERole.Owner, ERole.Admin)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updatePitchDto: UpdatePitchDto) {
    const data = await this.pitchService.update(id, updatePitchDto);

    return { data };
  }

  @ApiOkResponse({
    description: 'Delete pitch successfully!',
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.Owner, ERole.Admin)
  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.pitchService.softDelete(id);
  }
}

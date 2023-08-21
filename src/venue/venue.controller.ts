import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { BasePaginationResponse, BaseResponse } from 'src/common/dtos/base.dto';
import { RoleEnum } from 'src/common/enums/role.enum';
import { SearchService } from 'src/search/search.service';
import { In } from 'typeorm';
import { CreateVenueDto } from './dtos/create-venue.dto';
import { VenueQuery } from './dtos/query-venue.dto';
import { UpdateVenueDto } from './dtos/update-venue.dto';
import { Venue } from './entities/venue.entity';
import { VenueSearchBody } from './interfaces/venue-search.interface';
import { VenueService } from './venue.service';

@ApiTags('Venue')
@Controller('venues')
export class VenueController {
  constructor(private readonly venueService: VenueService, private readonly searchService: SearchService) {}

  @ApiResponse({
    description: 'Get venues successfully',
    type: BasePaginationResponse<Venue>,
  })
  @Get()
  @ResponseMessage('Get venues successfully')
  async findAll(@Query() query: VenueQuery) {
    const { location, page, limit, sorts } = query;

    const ids = await this.searchService.search<VenueSearchBody>('venues', location, [
      'name',
      'description',
      'district',
      'province',
    ]);

    return this.venueService.findMany(
      { page, limit, sorts },
      {
        where: {
          _id: In(ids),
        },
        relations: {
          pitches: true,
        },
      },
    );
  }

  @ApiOkResponse({
    description: 'Get venue successfully!',
    type: Venue,
  })
  @Get('user/:userId')
  @ResponseMessage('Get venue successfully')
  async findByUser(@Param('userId') userId: number) {
    const data = await this.venueService.findOne({
      where: {
        user: {
          _id: userId,
        },
      },
      relations: {
        pitches: {
          pitchCategory: true,
        },
      },
    });

    if (!data) {
      throw new NotFoundException('Venue not found');
    }
    return { data };
  }

  @ApiOkResponse({
    description: 'Get venue successfully!',
    type: Venue,
  })
  @Get(':slug')
  @ResponseMessage('Get venue successfully')
  async findBySlug(@Param('slug') slug: string) {
    const data = await this.venueService.findOne({
      where: {
        slug,
      },
      relations: {
        pitches: {
          pitchCategory: true,
        },
      },
    });

    if (!data) {
      throw new NotFoundException('Venue not found');
    }
    return { data };
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create Venue successfully',
    type: BaseResponse<Venue>,
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.Admin)
  @Post()
  @ResponseMessage('Create Venue successfully')
  async create(@Body() createVenueDto: CreateVenueDto) {
    const data = await this.venueService.create(createVenueDto);

    const { _id, name, description, district, province } = data;
    this.searchService.index<VenueSearchBody>('venues', {
      id: _id,
      name,
      description,
      province,
      district,
    });

    return { data };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update Venue successfully',
    type: BaseResponse<Venue>,
  })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.Owner)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateVenueDto: UpdateVenueDto) {
    const data = await this.venueService.update(id, updateVenueDto);

    return { data };
  }

  @HttpCode(204)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.Admin)
  @Delete(':id')
  delete(@Param('id') id: number) {
    this.venueService.softDelete(id);
  }
}

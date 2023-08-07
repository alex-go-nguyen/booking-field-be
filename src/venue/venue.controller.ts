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
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { BasePaginationResponse, BaseResponse } from 'src/common/dtos/base.dto';
import { OrderEnum } from 'src/common/enums/order.enum';
import { SearchService } from 'src/search/search.service';
import { In } from 'typeorm';
import { CreateVenueDto } from './dtos/create-venue.dto';
import { IVenueQuery } from './dtos/query-venue.dto';
import { ISearchListVenueQuery } from './dtos/search-list-venue.dto';
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
  async findAll(@Query() query: IVenueQuery) {
    const relations = ['pitches'];

    const keyword = query.keyword;
    const order = query.order || OrderEnum.Desc;

    if (keyword) {
      const ids = await this.searchService.search<VenueSearchBody>('venues', keyword, [
        'name',
        'description',
        'district',
        'province',
      ]);
      return this.venueService.findAndCount(query, {
        where: {
          _id: In(ids),
        },
        order: { name: order },
        relations,
      });
    }
    return this.venueService.findAndCount(query, {
      order: { name: order },
      relations,
    });
  }

  @ApiResponse({
    description: 'Search venues successfully',
    type: BasePaginationResponse<Venue>,
  })
  @ResponseMessage('Search venues successfully')
  @Get('/search')
  async search(@Query() query: ISearchListVenueQuery) {
    const location = query.location;

    const ids = await this.searchService.search<VenueSearchBody>('venues', location, [
      'name',
      'description',
      'district',
      'province',
    ]);

    console.log(ids);

    return this.venueService.searchListVenues(query, ids);
  }

  // @Get(':id')
  // @ResponseMessage('Venue founded successfully')
  // async findOne(@Param('id') id: number) {
  //   const data = await this.venueService.findOne({
  //     where: {
  //       _id: id,
  //     },
  //     relations: {
  //       pitches: {
  //         pitchCategory: true,
  //       },
  //     },
  //   });

  //   if (!data) {
  //     throw new NotFoundException('Venue not found');
  //   }
  //   return { data };
  // }

  @Get(':slug')
  @ResponseMessage('Venue founded successfully')
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateVenueDto: UpdateVenueDto) {
    const data = await this.venueService.update(id, updateVenueDto);

    return { data };
  }

  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    this.venueService.softDelete(id);
  }
}

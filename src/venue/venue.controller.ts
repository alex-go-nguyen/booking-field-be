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
import { RoleGuard } from 'src/auth/roles.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { BasePaginationResponse, BaseResponse } from 'src/common/dtos/base.dto';
import { RoleEnum } from 'src/common/enums/role.enum';
import { SearchService } from 'src/search/search.service';
import { UserService } from 'src/user/users.service';
import { In } from 'typeorm';
import { CreateVenueDto } from './dtos/create-venue.dto';
import { VenueQuery } from './dtos/query-venue.dto';
import { SearchListVenueQuery } from './dtos/search-list-venue.dto';
import { UpdateVenueDto } from './dtos/update-venue.dto';
import { Venue } from './entities/venue.entity';
import { VenueSearchBody } from './interfaces/venue-search.interface';
import { VenueService } from './venue.service';

@ApiTags('Venue')
@Controller('venues')
export class VenueController {
  constructor(
    private readonly venueService: VenueService,
    private readonly searchService: SearchService,
    private readonly userService: UserService,
  ) {}

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

    return this.venueService.findAndCount(
      { page, limit, sorts },
      {
        where: {
          id: In(ids),
        },
        relations: {
          pitches: true,
        },
      },
    );
  }

  @ApiOkResponse({
    description: 'Searc venues successfully!',
    type: Venue,
  })
  @Get('search')
  @ResponseMessage('Get venue successfully')
  async searchVenues(@Query() query: SearchListVenueQuery) {
    const { location } = query;

    const ids = await this.searchService.search<VenueSearchBody>('venues', location, [
      'name',
      'description',
      'district',
      'province',
    ]);

    return this.venueService.searchVenues(query, ids);
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
          id: userId,
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
  @Roles(RoleEnum.Admin)
  @UseGuards(RoleGuard)
  @Post()
  @ResponseMessage('Create Venue successfully')
  async create(@Body() createVenueDto: CreateVenueDto) {
    const { user } = createVenueDto;
    const data = await this.venueService.create(createVenueDto);

    const { id, name, description, district, province } = data;
    this.searchService.index<VenueSearchBody>('venues', {
      id,
      name,
      description,
      province,
      district,
    });

    await this.userService.update(user, { venue: data });

    return { data };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update Venue successfully',
    type: BaseResponse<Venue>,
  })
  @Roles(RoleEnum.Owner, RoleEnum.Admin)
  @UseGuards(RoleGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateVenueDto: UpdateVenueDto) {
    const data = await this.venueService.update(id, updateVenueDto);

    return { data };
  }

  @HttpCode(204)
  @Roles(RoleEnum.Admin)
  @UseGuards(RoleGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    this.venueService.softDelete(id);
  }
}

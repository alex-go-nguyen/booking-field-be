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
import { CurrentUser } from 'src/user/user.decorator';
import { UserService } from 'src/user/users.service';
import { ILike } from 'typeorm';
import { CreateVenueDto } from './dtos/create-venue.dto';
import { VenueQuery } from './dtos/query-venue.dto';
import { SearchListVenueQuery } from './dtos/search-list-venue.dto';
import { UpdateVenueDto } from './dtos/update-venue.dto';
import { Venue } from './entities/venue.entity';
import { VenueStatusEnum } from './enums/venue.enum';
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
    const { userId, status, keyword } = query;

    return this.venueService.findAndCount(query, {
      relations: {
        pitches: { pitchCategory: true },
        user: true,
      },
      where: [
        {
          ...(status ? { status } : { status: VenueStatusEnum.Active }),
          ...(userId && {
            user: {
              id: userId,
            },
          }),
          ...(keyword && {
            name: ILike(`%${keyword}%`),
          }),
        },
        {
          ...(status ? { status } : { status: VenueStatusEnum.Active }),
          ...(userId && {
            user: {
              id: userId,
            },
          }),
          ...(keyword && {
            user: {
              username: ILike(`%${keyword}%`),
            },
          }),
        },
      ],
    });
  }

  @ApiOkResponse({
    description: 'Search venues successfully!',
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

    if (ids.length === 0) {
      return { data: null };
    }

    return this.venueService.searchVenues(query, ids);
  }

  @ApiOkResponse({
    description: 'Search venues successfully!',
    type: Venue,
  })
  @Get('prominant')
  @ResponseMessage('Get venue successfully')
  getProminantVenues() {
    return this.venueService.getProminantVenues();
  }

  @ApiOkResponse({
    description: 'Search venues successfully!',
    type: Venue,
  })
  @Roles(RoleEnum.Owner, RoleEnum.Admin)
  @UseGuards(RoleGuard)
  @Get('me')
  @ResponseMessage('Get venue successfully')
  async getVenueByCurrentUser(@CurrentUser('id') userId: number) {
    const data = await this.venueService.findOne({
      where: {
        user: {
          id: userId,
        },
        status: VenueStatusEnum.Active,
      },
      relations: {
        pitches: {
          pitchCategory: true,
        },
      },
    });

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
        status: VenueStatusEnum.Active,
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
  @Roles(RoleEnum.User, RoleEnum.Admin)
  @UseGuards(RoleGuard)
  @Post()
  @ResponseMessage('Create Venue successfully')
  async create(@Body() createVenueDto: CreateVenueDto, @CurrentUser('role') role: RoleEnum) {
    const status = role === RoleEnum.Admin ? VenueStatusEnum.Active : VenueStatusEnum.Waiting;

    const data = await this.venueService.create({ ...createVenueDto, status });

    if (role === RoleEnum.Admin) {
      const { id, name, description, district, province } = data;
      this.searchService.index<VenueSearchBody>('venues', {
        id,
        name,
        description,
        province,
        district,
      });

      this.userService.update(createVenueDto.user, { role: RoleEnum.Owner });
    }

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
    await this.venueService.update(id, updateVenueDto);

    const data = await this.venueService.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
      },
    });

    if (data.status === VenueStatusEnum.Active) {
      const { id, name, description, district, province } = data;
      this.searchService.index<VenueSearchBody>('venues', {
        id,
        name,
        description,
        province,
        district,
      });
      this.userService.update(data.user.id, { role: RoleEnum.Owner });
    }
    if (data.status === VenueStatusEnum.Cancel) {
      this.userService.update(data.user.id, { role: RoleEnum.User });
    }

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

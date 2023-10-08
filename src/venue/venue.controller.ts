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
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/auth/roles.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { BasePaginationResponse, BaseResponse } from 'src/common/dtos/base.dto';
import { RoleEnum } from 'src/common/enums/role.enum';
import { CreateNotificationDto } from 'src/notification/dtos/create-notification.dto';
import { NotificationService } from 'src/notification/notification.service';
import { SocketService } from 'src/socket/socket.service';
import { CurrentUser } from 'src/user/user.decorator';
import { CreateVenueDto } from './dtos/create-venue.dto';
import { VenueQuery } from './dtos/query-venue.dto';
import { SearchVenuesQuery } from './dtos/search-list-venue.dto';
import { UpdateVenueDto } from './dtos/update-venue.dto';
import { Venue } from './entities/venue.entity';
import { VenueStatusEnum } from './enums/venue.enum';
import { VenueService } from './venue.service';

@ApiTags('Venue')
@Controller('venues')
export class VenueController {
  constructor(
    private readonly venueService: VenueService,
    private readonly notificationService: NotificationService,
    private readonly socketService: SocketService,
  ) {}

  @ApiResponse({
    description: 'Get venues successfully',
    type: BasePaginationResponse<Venue>,
  })
  @Get()
  @ResponseMessage('Get venues successfully')
  findAll(@Query() query: VenueQuery) {
    return this.venueService.findAllVenues(query);
  }

  @ApiOkResponse({
    description: 'Search venues successfully!',
    type: Venue,
  })
  @Get('search')
  @ResponseMessage('Get venue successfully')
  searchVenues(@Query() query: SearchVenuesQuery) {
    return this.venueService.searchVenues(query);
  }

  @ApiOkResponse({
    description: 'Search venues successfully!',
    type: Venue,
  })
  @Roles(RoleEnum.Owner, RoleEnum.Admin)
  @UseGuards(RoleGuard)
  @Get('me')
  @ResponseMessage('Get venue successfully')
  getVenueByCurrentUser(@CurrentUser('id') userId: number) {
    return this.venueService.getVenueByCurrentUser(userId);
  }

  @ApiOkResponse({
    description: 'Get venue successfully!',
    type: Venue,
  })
  @Get(':slug')
  @ResponseMessage('Get venue successfully')
  findBySlug(@Param('slug') slug: string) {
    return this.venueService.findBySlug(slug);
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
    return this.venueService.createVenue(createVenueDto, role);
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
    const data = await this.venueService.updateVenue(id, updateVenueDto);

    const message = {
      [VenueStatusEnum.Active]:
        'Sân bóng của bạn đã được xác nhận, bạn có thể quản lý sân bóng của mình trên hệ thống.',
      [VenueStatusEnum.Cancel]:
        'Yêu cầu sân bóng của bạn đã bị hủy, vui lòng liên hệ quản trị viên để biết thêm thông tin.',
    };

    if (updateVenueDto.status === VenueStatusEnum.Active || updateVenueDto.status === VenueStatusEnum.Cancel) {
      const createNotiPayload: CreateNotificationDto = {
        title: 'Thông báo từ quản trị viên',
        message: message[updateVenueDto.status],
        user: data.user.id,
      };

      await this.notificationService.create(createNotiPayload);

      this.socketService.socket.to(String(data.user.id)).emit('update_venue_status', message[data.status]);
    }

    return data;
  }

  @HttpCode(204)
  @Roles(RoleEnum.Admin)
  @UseGuards(RoleGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.venueService.softDelete(id);
  }
}

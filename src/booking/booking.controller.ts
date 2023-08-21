import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ReqUser } from 'src/common/decorators/user.decorator';
import { BaseQuery } from 'src/common/dtos/query.dto';
import { RoleEnum } from 'src/common/enums/role.enum';
import { dateToTimeFloat } from 'src/common/utils';
import { PitchService } from 'src/pitch/pitch.service';
import User from 'src/user/entities/user.entity';
import { Raw } from 'typeorm';
import { BookingService } from './booking.service';
import { BookingAnalystQuery } from './dtos/booking-analyst-query.dto';
import { BookingQuery } from './dtos/booking-query.dto';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';

@ApiTags('Booking')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService, private readonly pitchService: PitchService) {}

  @ResponseMessage('Get bookings successfully')
  @Get()
  findAll(@Query() query: BookingQuery) {
    const { pitchId, venueId, date } = query;
    return this.bookingService.findMany(query, {
      where: {
        ...(venueId && {
          pitch: {
            venue: {
              _id: venueId,
            },
          },
        }),
        ...(pitchId && {
          pitch: {
            _id: pitchId,
          },
        }),
        ...(date && { startTime: Raw((alias) => `DATE(${alias}) = DATE(:date)`, { date }) }),
      },
      relations: {
        pitch: {
          pitchCategory: true,
        },
        user: true,
      },
    });
  }

  @ResponseMessage('Get analyst successfully')
  @Get('analyst')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.Owner, RoleEnum.Admin)
  async analystIncome(@Query() query: BookingAnalystQuery) {
    const data = await this.bookingService.analystIncome(query);

    return { data };
  }

  @ResponseMessage('Get analyst by category successfully')
  @Get('analyst/category')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.Owner, RoleEnum.Admin)
  async analystCategory(@Query() query: BookingAnalystQuery) {
    const data = await this.bookingService.analystCategory(query);

    return { data };
  }

  @ResponseMessage('Get booking successfully')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.bookingService.findOne({
      where: {
        _id: id,
      },
      relations: {
        user: true,
        pitch: {
          pitchCategory: true,
          venue: true,
        },
        rating: true,
      },
    });

    return { data };
  }

  @ResponseMessage('Get booking of venue successfully')
  @Get('venue/:venueId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.Owner, RoleEnum.Admin)
  findByVenue(@Param('venueId') venueId: number, @Query() query: BaseQuery) {
    return this.bookingService.findMany(query, {
      where: {
        pitch: {
          venue: {
            _id: venueId,
          },
        },
      },
      relations: {
        pitch: {
          pitchCategory: true,
          venue: true,
        },
        rating: true,
      },
    });
  }

  @ResponseMessage('Create booking successfully')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createBookingDto: CreateBookingDto, @ReqUser() user: User) {
    const { pitch: pitchId, startTime, endTime } = createBookingDto;

    const pitch = await this.pitchService.findOne({
      where: {
        _id: pitchId,
      },
    });

    const totalPrice = pitch.price * (dateToTimeFloat(new Date(endTime)) - dateToTimeFloat(new Date(startTime)));

    const payload = { ...createBookingDto, user: user._id, total_price: totalPrice };

    const data = await this.bookingService.create(payload);

    return { data };
  }

  @ResponseMessage('Update booking successfully')
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateBookingDto: UpdateBookingDto) {
    const data = await this.bookingService.update(id, updateBookingDto);

    return { data };
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.Admin)
  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.bookingService.softDelete(id);
  }
}

import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { IBaseQuery } from 'src/common/dtos/query.dto';
import { ERole } from 'src/common/enums/role.enum';
import { dateToTimeFloat } from 'src/common/utils';
import { PitchService } from 'src/pitch/pitch.service';
import User from 'src/user/entities/user.entity';
import { Raw } from 'typeorm';
import { BookingService } from './booking.service';
import { IBookingAnalystQuery } from './dtos/booking-analyst-query.dto';
import { IBookingQuery } from './dtos/booking-query.dto';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';

@ApiTags('Booking')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService, private readonly pitchService: PitchService) {}

  @ResponseMessage('Get bookings successfully')
  @Get()
  findAll(@Query() query: IBookingQuery) {
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
  @Roles(ERole.Owner, ERole.Admin)
  async analystIncome(@Query() query: IBookingAnalystQuery) {
    const data = await this.bookingService.analystIncome(query);

    return { data };
  }

  @ResponseMessage('Get analyst by category successfully')
  @Get('analyst/category')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.Owner, ERole.Admin)
  async analystCategory(@Query() query: IBookingAnalystQuery) {
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
    });

    return { data };
  }

  @ResponseMessage('Get booking of venue successfully')
  @Get('venue/:venueId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ERole.Owner, ERole.Admin)
  findByVenue(@Param('venueId') venueId: number, @Query() query: IBaseQuery) {
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
        },
        user: true,
      },
    });
  }

  @ResponseMessage('Create booking successfully')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createBookingDto: CreateBookingDto, @Req() req) {
    const user: User = req['user'];

    const { pitch: pitchId, startTime, endTime } = createBookingDto;

    const pitch = await this.pitchService.findOne({
      where: {
        _id: pitchId,
      },
    });

    const totalPrice = pitch.price * (dateToTimeFloat(new Date(endTime)) - dateToTimeFloat(new Date(startTime)));

    console.log(totalPrice);

    const payload = { ...createBookingDto, user: user._id, total_price: totalPrice };

    console.log(payload);

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
  @Roles(ERole.Admin)
  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.bookingService.softDelete(id);
  }
}

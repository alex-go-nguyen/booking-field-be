import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { BaseQuery } from 'src/common/dtos/query.dto';
import { RoleEnum } from 'src/common/enums/role.enum';
import { dateToTimeFloat } from 'src/common/utils';
import { PitchService } from 'src/pitch/pitch.service';
import { CurrentUser } from 'src/user/user.decorator';
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
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: BookingQuery) {
    const { pitchId, venueId, date } = query;
    return this.bookingService.findAndCount(query, {
      where: {
        ...(venueId && {
          pitch: {
            venue: {
              id: venueId,
            },
          },
        }),
        ...(pitchId && {
          pitch: {
            id: pitchId,
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
  @Roles(RoleEnum.Owner, RoleEnum.Admin)
  @UseGuards(RoleGuard)
  async analystIncome(@Query() query: BookingAnalystQuery) {
    const data = await this.bookingService.analystIncome(query);

    return { data };
  }

  @ResponseMessage('Get analyst by category successfully')
  @Get('analyst/category')
  @Roles(RoleEnum.Owner, RoleEnum.Admin)
  @UseGuards(RoleGuard)
  async analystCategory(@Query() query: BookingAnalystQuery) {
    const data = await this.bookingService.analystCategory(query);

    return { data };
  }

  @ResponseMessage('Get user bookings successfully')
  @Get('user')
  getUserBookings(@CurrentUser('id') id: number, @Query() query: BaseQuery) {
    return this.bookingService.findAndCount(query, {
      where: {
        user: {
          id,
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

  @ResponseMessage('Get booking successfully')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.bookingService.findOne({
      where: {
        id,
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

  @ResponseMessage('Create booking successfully')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createBookingDto: CreateBookingDto, @CurrentUser('id') userId: number) {
    const { pitch: pitchId, startTime, endTime } = createBookingDto;

    const pitch = await this.pitchService.findOne({
      where: {
        id: pitchId,
      },
    });

    const totalPrice = pitch.price * (dateToTimeFloat(new Date(endTime)) - dateToTimeFloat(new Date(startTime)));

    const payload = { ...createBookingDto, user: userId, totalPrice };

    const data = await this.bookingService.create(payload);

    return { data };
  }

  @ResponseMessage('Update booking successfully')
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateBookingDto: UpdateBookingDto) {
    const data = await this.bookingService.update(id, updateBookingDto);

    return { data };
  }

  @UseGuards(RoleGuard)
  @Roles(RoleEnum.Admin)
  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.bookingService.softDelete(id);
  }
}

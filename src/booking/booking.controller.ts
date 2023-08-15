import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Role } from 'src/common/decorators/roles.decorator';
import { RoleEnum } from 'src/common/enums/role.enum';
import User from 'src/user/entities/user.entity';
import { BookingService } from './booking.service';
import { IBookingQuery } from './dtos/booking-query.dto';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { UpdateBookingDto } from './dtos/update-booking.dto';

@ApiTags('Booking')
@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @ResponseMessage('Get bookings successfully')
  @Get()
  findAll(@Query() query: IBookingQuery) {
    return this.bookingService.findAllBookings(query);
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

  @ResponseMessage('Get user bookings successfully')
  @Get('user/:id')
  getUserBookings(@Param('id') id: number, @Query() query: IBookingQuery) {
    return this.bookingService.findMany(query, {
      where: {
        user: {
          _id: id,
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
  async create(@Body() createBookingDto: CreateBookingDto, @Req() req) {
    const user: User = req['user'];

    const data = await this.bookingService.create({ ...createBookingDto, user: user._id });

    return { data };
  }

  @ResponseMessage('Update booking successfully')
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateBookingDto: UpdateBookingDto) {
    const data = await this.bookingService.update(id, updateBookingDto);

    return { data };
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(RoleEnum.Admin)
  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.bookingService.softDelete(id);
  }
}

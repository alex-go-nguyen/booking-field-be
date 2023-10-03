import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
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
    return this.bookingService.findAllBooking(query);
  }

  @ResponseMessage('Get analyst successfully')
  @Get('analyst')
  @Roles(RoleEnum.Owner, RoleEnum.Admin)
  @UseGuards(RoleGuard)
  analystIncome(@Query() query: BookingAnalystQuery) {
    return this.bookingService.analystIncome(query);
  }

  @ResponseMessage('Get analyst by category successfully')
  @Get('analyst/category')
  @Roles(RoleEnum.Owner, RoleEnum.Admin)
  @UseGuards(RoleGuard)
  analystCategory(@Query() query: BookingAnalystQuery) {
    return this.bookingService.analystCategory(query);
  }

  @ResponseMessage('Get user bookings successfully')
  @Get('user')
  @UseGuards(JwtAuthGuard)
  getUserBookings(@CurrentUser('id') id: number, @Query() query: BaseQuery) {
    return this.bookingService.getUserBookings(id, query);
  }

  @ResponseMessage('Get booking successfully')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.bookingService.findOneBooking(id);
  }

  @ResponseMessage('Create booking successfully')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBookingDto: CreateBookingDto, @CurrentUser('id') userId: number) {
    return this.bookingService.createBooking(createBookingDto, userId);
  }

  @ResponseMessage('Update booking successfully')
  @Put(':id')
  update(@Param('id') id: number, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto);
  }

  @UseGuards(RoleGuard)
  @Roles(RoleEnum.Admin, RoleEnum.Owner)
  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.bookingService.softDelete(id);
  }
}

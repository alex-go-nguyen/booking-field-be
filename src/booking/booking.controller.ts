import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/roles.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Role } from 'src/common/decorators/roles.decorator';
import { ERole } from 'src/common/enums/role.enum';
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
    });

    return { data };
  }

  @ResponseMessage('Create booking successfully')
  @Post()
  async create(@Body() createBookingDto: CreateBookingDto) {
    const data = await this.bookingService.create(createBookingDto);

    return { data };
  }

  @ResponseMessage('Update booking successfully')
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateBookingDto: UpdateBookingDto) {
    const data = await this.bookingService.update(id, updateBookingDto);

    return { data };
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(ERole.Admin)
  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.bookingService.softDelete(id);
  }
}

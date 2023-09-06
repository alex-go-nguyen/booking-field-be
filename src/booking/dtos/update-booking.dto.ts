import { PartialType } from '@nestjs/swagger';
import { Booking } from '../entities/booking.entity';

export class UpdateBookingDto extends PartialType(Booking) {}

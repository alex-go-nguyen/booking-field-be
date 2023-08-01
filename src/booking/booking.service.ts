import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingService extends BaseService<Booking, unknown> {
  constructor(@InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>) {
    super(bookingRepository);
  }
}

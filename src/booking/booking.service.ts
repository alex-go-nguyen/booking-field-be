import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { FindBookingFreeTimeDto } from './dtos/find-freetime.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingService extends BaseService<Booking, unknown> {
  constructor(@InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>) {
    super(bookingRepository);
  }

  async findBookingOfPitchByDay(query: FindBookingFreeTimeDto) {
    const { date, pitchId } = query;

    const data = this.bookingRepository
      .createQueryBuilder('b')
      .select('*')
      .where('b.pitch_id = :pitchId', { pitchId })
      .andWhere('DATE(b.startTime) = DATE(:date)', { date })
      .getRawMany();
    return data;
  }
}

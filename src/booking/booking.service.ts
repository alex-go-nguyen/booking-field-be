import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Pitch } from 'src/pitch/entities/pitch.entity';
import { PitchCategory } from 'src/pitch-category/entities/pitch-category.entity';
import { Repository } from 'typeorm';
import { IBookingAnalystQuery } from './dtos/booking-analyst-query.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingService extends BaseService<Booking, unknown> {
  constructor(@InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>) {
    super(bookingRepository);
  }

  analystIncome(@Query() query: IBookingAnalystQuery) {
    const { year, venueId } = query;

    const qb = this.bookingRepository
      .createQueryBuilder('b')
      .select("TO_CHAR(DATE_TRUNC('DAY', b.startTime), 'mm/dd/yyyy')", 'day')
      .addSelect('SUM(total_price)::int', 'total')
      .leftJoin(Pitch, 'p', 'b.pitch_id = p._id')
      .where("DATE_PART('YEAR', b.startTime) = :year", { year })
      .andWhere('p.venue_id = :venueId', { venueId })
      .groupBy("DATE_TRUNC('DAY', b.startTime)");

    const data = qb.getRawMany();

    return data;
  }

  analystCategory(@Query() query: IBookingAnalystQuery) {
    const { year, venueId } = query;

    const qb = this.bookingRepository
      .createQueryBuilder('b')
      .select('p.pitchCategory_id', 'pitchCategory_id')
      .addSelect('pc.name', 'category')
      .addSelect('COUNT(*)::int', 'total')
      .leftJoin(Pitch, 'p', 'b.pitch_id = p._id')
      .leftJoin(PitchCategory, 'pc', 'p.pitchCategory_id = pc._id')
      .where("DATE_PART('YEAR', b.createdAt) = :year", { year })
      .andWhere('p.venue_id = :venueId', { venueId })
      .groupBy('pc.name')
      .addGroupBy('p.pitchCategory_id');

    const data = qb.getRawMany();

    return data;
  }
}

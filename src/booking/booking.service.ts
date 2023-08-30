import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Pitch } from 'src/pitch/entities/pitch.entity';
import { PitchCategory } from 'src/pitch-category/entities/pitch-category.entity';
import { Repository } from 'typeorm';
import { BookingAnalystQuery } from './dtos/booking-analyst-query.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingService extends BaseService<Booking, unknown> {
  constructor(@InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>) {
    super(bookingRepository);
  }

  analystIncome({ year, venueId }: BookingAnalystQuery) {
    const qb = this.bookingRepository
      .createQueryBuilder('b')
      .select("TO_CHAR(DATE_TRUNC('DAY', b.createdAt), 'mm/dd/yyyy')", 'day')
      .addSelect('SUM(b.totalPrice)::int', 'total')
      .leftJoin(Pitch, 'p', 'b.pitchId = p.id')
      .where("DATE_PART('YEAR', b.createdAt) = :year", { year })
      .andWhere('p.venueId = :venueId', { venueId })
      .groupBy("DATE_TRUNC('DAY', b.createdAt)");

    return qb.getRawMany();
  }

  analystCategory({ year, venueId }: BookingAnalystQuery) {
    const qb = this.bookingRepository
      .createQueryBuilder('b')
      .select('p.pitchCategoryId', 'pitchCategoryId')
      .addSelect('pc.name', 'category')
      .addSelect('COUNT(*)::int', 'total')
      .leftJoin(Pitch, 'p', 'b.pitchId = p.id')
      .leftJoin(PitchCategory, 'pc', 'p.pitchCategoryId = pc.id')
      .where("DATE_PART('YEAR', b.createdAt) = :year", { year })
      .andWhere('p.venueId = :venueId', { venueId })
      .groupBy('pc.name')
      .addGroupBy('p.pitchCategoryId');

    return qb.getRawMany();
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { IBookingQuery } from './dtos/booking-query.dto';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingService extends BaseService<Booking, unknown> {
  constructor(@InjectRepository(Booking) private readonly bookingRepository: Repository<Booking>) {
    super(bookingRepository);
  }

  async findAllBookings(options: IBookingQuery) {
    const { date, pitchId, page, limit, sorts } = options;

    const take = limit || 0;

    const skip = (page - 1) * take;

    const qb = this.bookingRepository.createQueryBuilder('b').select('*');

    if (date && pitchId) {
      qb.where('b.pitch_id = :pitchId', { pitchId }).andWhere('DATE(b.startTime) = DATE(:date)', { date });
    }

    if (page && limit) {
      qb.take(take).skip(skip);
    }

    if (sorts) {
      sorts.map((sort) => {
        const field = Object.keys(sort);
        const order = sort[`${field}`];

        console.log(field[0], order);
        qb.addOrderBy(`b.${field[0]}`, order);
      });
    }

    const dataQb = qb.getRawMany();
    const countQb = qb.getCount();

    const [data, total] = await Promise.all([dataQb, countQb]);

    const pageCount = take === 0 ? 1 : Math.ceil(total / take);
    const pageSize = take === 0 ? total : take;

    return {
      data,
      pageInfo: {
        page,
        pageSize,
        pageCount,
        count: total,
      },
    };
  }
}

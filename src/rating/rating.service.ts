import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from 'src/booking/entities/booking.entity';
import { Pagination } from 'src/common/dtos/pagination.dto';
import { OrderEnum } from 'src/common/enums/order.enum';
import { BaseService } from 'src/common/services/base.service';
import { Pitch } from 'src/pitch/entities/pitch.entity';
import { PitchCategory } from 'src/pitch-category/entities/pitch-category.entity';
import User from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';

@Injectable()
export class RatingService extends BaseService<Rating, unknown> {
  constructor(@InjectRepository(Rating) private readonly ratingRepository: Repository<Rating>) {
    super(ratingRepository);
  }

  async findByVenue(venueId: number, query: Pagination) {
    const { limit, page } = query;
    const take = limit || 0;
    const skip = (page - 1) * take;

    const queryBuilder = this.ratingRepository
      .createQueryBuilder('r')
      .select('r.*')
      .addSelect('c.name', 'category_name')
      .addSelect('u.*')
      .innerJoin(Booking, 'b', 'r.booking_id = b."_id"')
      .leftJoin(Pitch, 'p', 'b."pitch_id" = p."_id"')
      .leftJoin(PitchCategory, 'c', 'c._id = p.pitchCategory_id')
      .leftJoin(User, 'u', 'u._id = b.user_id')
      .where('p."venue_id" = :venueId', { venueId })
      .take(take)
      .skip(skip)
      .orderBy('r.createdAt', OrderEnum.Desc);

    const dataQb = queryBuilder.getRawMany();
    const countQb = queryBuilder.getCount();

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

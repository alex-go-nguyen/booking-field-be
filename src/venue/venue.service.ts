import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from 'src/booking/entities/booking.entity';
import { BaseService } from 'src/common/services/base.service';
import { Pitch } from 'src/pitch/entities/pitch.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { Repository } from 'typeorm';
import { SearchListVenueQuery } from './dtos/search-list-venue.dto';
import { Venue } from './entities/venue.entity';

@Injectable()
export class VenueService extends BaseService<Venue, unknown> {
  constructor(
    @InjectRepository(Venue) private venueRepository: Repository<Venue>,
    @InjectRepository(Rating) private ratingRepository: Repository<Rating>,
    @InjectRepository(Pitch) private pitchRepository: Repository<Pitch>,
  ) {
    super(venueRepository);
  }

  async searchVenues(query?: SearchListVenueQuery, venueIds?: Array<number>) {
    const { limit, page, sorts, maxPrice, minPrice, pitchCategory: pitchCategory } = query;
    const take = limit || 0;
    const skip = (page - 1) * take;

    const subQb = this.venueRepository
      .createQueryBuilder('v')
      .select('v.id', 'id')
      .addSelect('p.price', 'price')
      .leftJoin(Pitch, 'p', 'v.id = p.venueId')
      .leftJoin(Booking, 'b', 'p.id = b.pitchId')
      .leftJoin(Rating, 'r', 'r.bookingId = b.id')
      .where('p.price > :minPrice')
      .andWhere('p.price < :maxPrice')
      .andWhere('p.pitchCategoryId = :pitchCategoryId')
      .andWhere('v.id IN (:...ids)')
      .groupBy('v.id')
      .addGroupBy('p.price')
      .addGroupBy('p.pitchCategoryId')
      .getQuery();

    const subQb2 = this.ratingRepository
      .createQueryBuilder('r')
      .select('*')
      .leftJoin(Booking, 'b', 'b.id = r.bookingId')
      .getQuery();

    const mainQb2 = this.pitchRepository
      .createQueryBuilder('p')
      .select('p."venueId"', 'venueId')
      .addSelect('AVG(rb.rate)::int', 'averageRate')
      .addSelect('COUNT(rb.rate)::int', 'totalReview')
      .leftJoin(`(${subQb2})`, 'rb', 'rb."pitchId" = p.id')
      .groupBy('p."venueId"')
      .getQuery();

    const mainQb = this.venueRepository
      .createQueryBuilder('v')
      .select('v.*')
      .addSelect('vp.*')
      .addSelect('pr.*')
      .leftJoin(`(${subQb})`, 'vp', 'v.id = vp.id')
      .leftJoin(`(${mainQb2})`, 'pr', 'pr."venueId" = v.id')
      .setParameters({ maxPrice, minPrice, pitchCategoryId: pitchCategory, ids: venueIds })
      .where('vp.id notnull');

    if (sorts) {
      sorts?.map((sort) => {
        const { field, order } = sort;
        mainQb.addOrderBy(`vp.${field}`, order);
      });
    }
    mainQb.take(take).skip(skip);

    const dataQb = mainQb.getRawMany();
    const countQb = mainQb.getCount();

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

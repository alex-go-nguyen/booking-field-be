import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Booking } from 'src/booking/entities/booking.entity';
import { BaseService } from 'src/common/services/base.service';
import { Pitch } from 'src/pitch/entities/pitch.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { Repository } from 'typeorm';
import { CreateVenueDto } from './dtos/create-venue.dto';
import { SearchListVenueQuery } from './dtos/search-list-venue.dto';
import { Venue } from './entities/venue.entity';

@Injectable()
export class VenueService extends BaseService<Venue, CreateVenueDto> {
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
      .select('v._id', '_id')
      .addSelect('p.price', 'price')
      .leftJoin(Pitch, 'p', 'v._id = p.venue_id')
      .leftJoin(Booking, 'b', 'p._id = b.pitch_id')
      .leftJoin(Rating, 'r', 'r.booking_id = b._id')
      .where('p.price > :minPrice')
      .andWhere('p.price < :maxPrice')
      .andWhere('p.pitchCategory_id = :pitchCategory_id')
      .andWhere('v._id IN (:...ids)')
      .groupBy('v._id')
      .addGroupBy('p.price')
      .addGroupBy('p.pitchCategory_id')
      .getQuery();

    const subQb2 = this.ratingRepository
      .createQueryBuilder('r')
      .select('*')
      .leftJoin(Booking, 'b', 'b._id = r.booking_id')
      .getQuery();

    const mainQb2 = this.pitchRepository
      .createQueryBuilder('p')
      .select('p.venue_id', 'venue_id')
      .addSelect('AVG(rb.rate)::int', 'averageRate')
      .addSelect('COUNT(rb.rate)::int', 'totalReview')
      .leftJoin(`(${subQb2})`, 'rb', 'rb.pitch_id = p._id')
      .groupBy('p.venue_id')
      .getQuery();

    const mainQb = this.venueRepository
      .createQueryBuilder('v')
      .select('v.*')
      .addSelect('vp.*')
      .addSelect('pr.*')
      .leftJoin(`(${subQb})`, 'vp', 'v._id = vp._id')
      .leftJoin(`(${mainQb2})`, 'pr', 'pr.venue_id = v._id')
      .setParameters({ maxPrice, minPrice, pitchCategory_id: pitchCategory, ids: venueIds })
      .where('vp._id notnull');

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

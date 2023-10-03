import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { CreateRatingDto } from './dtos/create-rating.dto';
import { RatingQuery } from './dtos/rating-query.dto';
import { UpdateRatingDto } from './dtos/update-rating.dto';
import { Rating } from './entities/rating.entity';

@Injectable()
export class RatingService extends BaseService<Rating, unknown> {
  constructor(@InjectRepository(Rating) private readonly ratingRepository: Repository<Rating>) {
    super(ratingRepository);
  }

  findAllRating(query: RatingQuery) {
    const { venueId } = query;

    return this.findAndCount(query, {
      where: {
        ...(venueId && {
          booking: {
            pitch: {
              venue: {
                id: venueId,
              },
            },
          },
        }),
      },
      relations: {
        booking: {
          user: true,
          pitch: {
            pitchCategory: true,
            venue: true,
          },
        },
      },
    });
  }

  findById(id: number) {
    return this.findOne({
      where: {
        id,
      },
    });
  }
}

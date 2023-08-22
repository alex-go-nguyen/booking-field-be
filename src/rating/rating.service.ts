import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { Rating } from './entities/rating.entity';

@Injectable()
export class RatingService extends BaseService<Rating, unknown> {
  constructor(@InjectRepository(Rating) private readonly ratingRepository: Repository<Rating>) {
    super(ratingRepository);
  }
}

import { PartialType } from '@nestjs/swagger';
import { Rating } from '../entities/rating.entity';

export class UpdateRatingDto extends PartialType(Rating) {}

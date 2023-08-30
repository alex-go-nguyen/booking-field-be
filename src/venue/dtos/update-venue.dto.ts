import { PartialType } from '@nestjs/swagger';
import { Venue } from '../entities/venue.entity';

export class UpdateVenueDto extends PartialType(Venue) {}

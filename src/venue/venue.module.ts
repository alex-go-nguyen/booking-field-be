import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from 'src/booking/entities/booking.entity';
import { Booking } from 'src/booking/entities/booking.entity';
import { NotificationModule } from 'src/notification/notification.module';
import { Pitch } from 'src/pitch/entities/pitch.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { SearchModule } from 'src/search/search.module';
import { UserModule } from 'src/user/users.module';
import { Venue } from './entities/venue.entity';
import { VenueController } from './venue.controller';
import { VenueGateway } from './venue.gateway';
import { VenueService } from './venue.service';

@Module({
  imports: [TypeOrmModule.forFeature([Venue, Rating, Pitch]), SearchModule, UserModule, NotificationModule],
  controllers: [VenueController],
  providers: [VenueService, VenueGateway],
  exports: [VenueService],
})
export class VenueModule {}

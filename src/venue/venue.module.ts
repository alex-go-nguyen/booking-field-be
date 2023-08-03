import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchModule } from 'src/search/search.module';
import { Venue } from './entities/venue.entity';
import { VenueController } from './venue.controller';
import { VenueService } from './venue.service';

@Module({
  imports: [TypeOrmModule.forFeature([Venue]), SearchModule],
  controllers: [VenueController],
  providers: [VenueService],
  exports: [VenueService],
})
export class VenueModule {}

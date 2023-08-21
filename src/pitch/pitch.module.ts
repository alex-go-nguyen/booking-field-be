import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PitchCategoryModule } from 'src/pitch-category/pitch-category.module';
import { SearchModule } from 'src/search/search.module';
import { UserModule } from 'src/user/users.module';
import { VenueModule } from 'src/venue/venue.module';
import { Pitch } from './entities/pitch.entity';
import { PitchController } from './pitch.controller';
import { PitchService } from './pitch.service';

@Module({
  imports: [VenueModule, TypeOrmModule.forFeature([Pitch]), JwtModule, UserModule, PitchCategoryModule, SearchModule],
  providers: [PitchService],
  controllers: [PitchController],
  exports: [PitchService],
})
export class PitchModule {}

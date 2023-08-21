import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PitchModule } from 'src/pitch/pitch.module';
import { UserModule } from 'src/user/users.module';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { Booking } from './entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), JwtModule, UserModule, PitchModule],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}

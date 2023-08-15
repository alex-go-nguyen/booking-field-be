import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DatabaseModule } from './database/database.module';
import { PitchModule } from './pitch/pitch.module';
import { PitchCategoryModule } from './pitch-category/pitch-category.module';
import { RatingModule } from './rating/rating.module';
import { SearchModule } from './search/search.module';
import { StripeModule } from './stripe/stripe.module';
import { StripeService } from './stripe/stripe.service';
import { UserModule } from './user/users.module';
import { VenueModule } from './venue/venue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    VenueModule,
    PitchModule,
    BookingModule,
    PitchCategoryModule,
    SearchModule,
    CloudinaryModule,
    RatingModule,
    DatabaseModule,
    StripeModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    StripeService,
  ],
})
export class AppModule {}

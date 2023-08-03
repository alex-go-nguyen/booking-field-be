import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { PitchModule } from './pitch/pitch.module';
import { PitchCategoryModule } from './pitch-category/pitch-category.module';
import { RatingModule } from './rating/rating.module';
import { SearchModule } from './search/search.module';
import { UserModule } from './user/users.module';
import { VenueModule } from './venue/venue.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        synchronize: configService.get<string>('NODE_ENV') == 'production' ? false : true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
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
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}

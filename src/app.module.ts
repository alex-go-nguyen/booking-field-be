import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { CategoryModule } from './category/category.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { EvaluateModule } from './evaluate/evaluate.module';
import { FieldModule } from './field/field.module';
import { PriceModule } from './price/price.module';
import { SearchModule } from './search/search.module';
import { SubFieldModule } from './sub-field/sub-field.module';
import { UserModule } from './user/users.module';

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
    FieldModule,
    SubFieldModule,
    BookingModule,
    CategoryModule,
    SearchModule,
    CloudinaryModule,
    PriceModule,
    EvaluateModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}

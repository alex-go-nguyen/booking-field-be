import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { AppGateway } from './app.gateway';
import { AuthModule } from './auth/auth.module';
import { BookingModule } from './booking/booking.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DatabaseModule } from './database/database.module';
import { ForgottenPasswordModule } from './forgotten-password/forgotten-password.module';
import { MatchModule } from './match/match.module';
import { NotificationModule } from './notification/notification.module';
import { PitchModule } from './pitch/pitch.module';
import { PitchCategoryModule } from './pitch-category/pitch-category.module';
import { RatingModule } from './rating/rating.module';
import { RoundModule } from './round/round.module';
import { SearchModule } from './search/search.module';
import { SocketModule } from './socket/socket.module';
import { StripeModule } from './stripe/stripe.module';
import { StripeService } from './stripe/stripe.service';
import { TeamModule } from './team/team.module';
import { TournamentModule } from './tournament/tournament.module';
import { UserModule } from './user/users.module';
import { VenueModule } from './venue/venue.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET_KEY') || 'secret';
        const expiresIn = configService.get<string>('EXPIRES_IN') || '1d';
        return {
          secret,
          signOptions: {
            expiresIn,
          },
        };
      },
      global: true,
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
    ForgottenPasswordModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          port: 1025,
          ignoreTLS: true,
          secure: false,
          transport: {
            host: configService.get('MAILER_HOST'),
            auth: {
              user: configService.get<string>('MAILER_USER'),
              pass: configService.get<string>('MAILER_PASS'),
            },
          },
          defaults: {
            from: '"nest-modules" <modules@nestjs.com>',
          },
          template: {
            dir: process.cwd() + '/templates',
            adapter: new EjsAdapter(),
            options: {
              strict: false,
            },
          },
        };
      },
    }),
    NotificationModule,
    TournamentModule,
    MatchModule,
    TeamModule,
    RoundModule,
    SocketModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    StripeService,
    AppGateway,
  ],
})
export class AppModule {}

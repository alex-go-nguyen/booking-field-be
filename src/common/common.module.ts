import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
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
  ],
})
export class CommonModule {}

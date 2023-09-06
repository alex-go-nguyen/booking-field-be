import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ForgottenPasswordModule } from 'src/forgotten-password/forgotten-password.module';
import { UserModule } from 'src/user/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [ConfigModule, UserModule, ForgottenPasswordModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

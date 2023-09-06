import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForgottenPassowrd } from 'src/user/entities/forgotten-password.entity';
import { ForgottenPasswordService } from './forgotten-password.service';

@Module({
  imports: [TypeOrmModule.forFeature([ForgottenPassowrd])],
  providers: [ForgottenPasswordService],
  exports: [ForgottenPasswordService],
})
export class ForgottenPasswordModule {}

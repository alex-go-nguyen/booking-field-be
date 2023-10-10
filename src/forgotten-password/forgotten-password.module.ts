import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForgottenPassword } from 'src/user/entities/forgotten-password.entity';
import { ForgottenPasswordService } from './forgotten-password.service';

@Module({
  imports: [TypeOrmModule.forFeature([ForgottenPassword])],
  providers: [ForgottenPasswordService],
  exports: [ForgottenPasswordService],
})
export class ForgottenPasswordModule {}

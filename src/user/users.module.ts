import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import User from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}

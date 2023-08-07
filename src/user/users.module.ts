import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './users.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User]), JwtModule],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}

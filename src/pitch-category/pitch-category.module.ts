import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/users.module';
import { PitchCategory } from './entities/pitch-category.entity';
import { PitchCategoryController } from './pitch-category.controller';
import { PitchCategoryService } from './pitch-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([PitchCategory]), JwtModule, UserModule],
  providers: [PitchCategoryService],
  controllers: [PitchCategoryController],
  exports: [PitchCategoryService],
})
export class PitchCategoryModule {}

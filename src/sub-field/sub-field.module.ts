import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from 'src/category/category.module';
import { FieldModule } from 'src/field/field.module';
import { SearchModule } from 'src/search/search.module';
import { UserModule } from 'src/user/users.module';
import { SubField } from './entities/sub-field.entity';
import { SubFieldController } from './sub-field.controller';
import { SubFieldService } from './sub-field.service';

@Module({
  imports: [FieldModule, TypeOrmModule.forFeature([SubField]), JwtModule, UserModule, CategoryModule, SearchModule],
  providers: [SubFieldService],
  controllers: [SubFieldController],
})
export class SubFieldModule {}

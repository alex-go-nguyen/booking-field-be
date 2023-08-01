import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchModule } from 'src/search/search.module';
import { Field } from './entities/field.entity';
import { FieldController } from './field.controller';
import { FieldService } from './field.service';

@Module({
  imports: [TypeOrmModule.forFeature([Field]), SearchModule],
  controllers: [FieldController],
  providers: [FieldService],
  exports: [FieldService],
})
export class FieldModule {}

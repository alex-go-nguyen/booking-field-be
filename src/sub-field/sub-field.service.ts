import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/category/entities/category.entity';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { SubField } from './entities/sub-field.entity';

@Injectable()
export class SubFieldService extends BaseService<SubField, unknown> {
  constructor(@InjectRepository(SubField) private subFieldRepository: Repository<SubField>) {
    super(subFieldRepository);
  }

  async findInField(fieldId: string) {
    const data = await this.subFieldRepository
      .createQueryBuilder('sf')
      .select('sf.category_id')
      .addSelect('sf.price', 'price')
      .addSelect('c.*')
      .addSelect('count(category_id)', 'quantity')
      .leftJoin(Category, 'c', 'sf.category_id = c._id')
      .where('sf.field_id = :fieldId', { fieldId })
      .groupBy('sf.category_id')
      .addGroupBy('sf.price')
      .addGroupBy('c._id')
      .getRawMany();

    return data;
  }
}

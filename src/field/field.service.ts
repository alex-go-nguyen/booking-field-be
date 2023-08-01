import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEnum } from 'src/common/enums/order.enum';
import { BaseService } from 'src/common/services/base.service';
import { ISearchListFieldQuery } from 'src/sub-field/dtos/search-list-field.dto';
import { Repository } from 'typeorm';
import { CreateFieldDto } from './dtos/create-field.dto';
import { Field } from './entities/field.entity';

@Injectable()
export class FieldService extends BaseService<Field, CreateFieldDto> {
  constructor(@InjectRepository(Field) private fieldRepository: Repository<Field>) {
    super(fieldRepository);
  }

  async searchListFields(query?: ISearchListFieldQuery, fieldIds?: Array<string>) {
    const { limit, page, order, maxPrice, minPrice, category } = query;
    const take = limit || 0;
    const skip = (page - 1) * take;

    const subQuery = this.fieldRepository
      .createQueryBuilder('f')
      .select('f._id', '_id')
      .addSelect('sf.price', 'price')
      .addSelect('sf.category_id', 'category_id')
      .leftJoin('sub-field', 'sf', 'f._id = sf.field_id')
      .where('sf.price > :minPrice')
      .andWhere('sf.price < :maxPrice')
      .andWhere('sf.category_id = :category_id')
      .andWhere('f._id IN (:...ids)')
      .orderBy('sf.price', order || OrderEnum.Asc)
      .take(take)
      .skip(skip)
      .groupBy('f._id')
      .addGroupBy('sf.price')
      .addGroupBy('sf.category_id')
      .getQuery();

    const mainQuery = this.fieldRepository
      .createQueryBuilder('f')
      .select('f.*')
      .addSelect('fp.*')
      .leftJoin(`(${subQuery})`, 'fp', 'f._id = fp._id')
      .setParameters({ maxPrice, minPrice, category_id: category, ids: fieldIds })
      .where('fp._id notnull');

    const dataQb = mainQuery.getRawMany();
    const countQb = mainQuery.getCount();

    const [data, total] = await Promise.all([dataQb, countQb]);

    const pageCount = take === 0 ? 1 : Math.ceil(total / take);
    const pageSize = take === 0 ? total : take;

    return {
      data,
      pageInfo: {
        page,
        pageSize,
        pageCount,
        count: total,
      },
    };
  }
}

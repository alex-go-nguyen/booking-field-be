import { NotFoundException } from '@nestjs/common';
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { BaseQuery } from '../dtos/query.dto';
import { Base } from '../entities/base.entity';

export class BaseService<Entity extends Base, Dto extends DeepPartial<Entity>> {
  constructor(protected repo: Repository<Entity>) {}

  async findAndCount(query?: BaseQuery, options?: FindManyOptions<Entity>) {
    const { limit, page, sorts } = query;

    const take = limit || 0;
    const skip = (page - 1) * take;
    const order = {};

    sorts?.map((sort) => {
      order[sort.field] = sort.order;
    });

    const [data, total] = await this.repo.findAndCount({
      take,
      skip,
      order,
      ...options,
    });

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

  findAll(options?: FindManyOptions<Entity>) {
    return this.repo.find(options);
  }

  findById(_id: number) {
    return this.repo.findOne({
      where: {
        _id,
      } as FindOptionsWhere<Entity>,
    });
  }

  findOne(options: FindOneOptions<Entity>) {
    return this.repo.findOne(options);
  }

  create(data: Dto) {
    const newData = this.repo.create(data);

    return this.repo.save(newData);
  }

  async update(_id: number, data: DeepPartial<Dto>) {
    const existData = await this.findOne({
      where: {
        _id,
      } as FindOptionsWhere<Entity>,
    });

    if (!existData) {
      throw new NotFoundException('Resource not found!');
    }

    const updatedData = this.repo.create({ ...existData, ...data });

    return this.repo.save(updatedData);
  }

  async softDelete(_id: number) {
    const existData = await this.findOne({
      where: {
        _id,
      } as FindOptionsWhere<Entity>,
    });

    if (!existData) {
      throw new NotFoundException('Resource not found!');
    }

    return this.repo.softDelete(_id);
  }
}

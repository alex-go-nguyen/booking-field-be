import { NotFoundException } from '@nestjs/common';
import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { IPagination } from '../dtos/pagination.dto';
import { Base } from '../entities/base.entity';

export class BaseService<Entity extends Base, Dto extends DeepPartial<Entity>> {
  constructor(protected repo: Repository<Entity>) {}

  async findAndCount(query?: IPagination, options?: FindManyOptions<Entity>) {
    const take = query?.limit || 0;
    const page = query?.page || 1;
    const skip = (page - 1) * take;

    const [data, total] = await this.repo.findAndCount({
      take,
      skip,
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

  findById(_id: string) {
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

  async update(_id: string, data: DeepPartial<Entity>) {
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

  async softDelete(_id: string) {
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

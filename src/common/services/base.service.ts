import { Repository } from 'typeorm';
import { Base } from '../entities/base.entity';

export class BaseService<Entity extends Base, Dto> {
  constructor(protected repo: Repository<Entity>) {}

  async findOne(_id: number): Promise<any> {
    return this.repo.findOne({
      where: {
        _id: _id as any,
      },
    });
  }

  async create(data: Dto) {
    const savedData = await this.repo.save(data as any);

    return savedData;
  }

  async update(_id: number, data: any): Promise<any> {
    const updateResult = await this.repo.update(_id, data);

    return updateResult;
  }
}

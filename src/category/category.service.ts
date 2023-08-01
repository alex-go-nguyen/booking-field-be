import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService extends BaseService<Category, unknown> {
  constructor(@InjectRepository(Category) private readonly categoryService: Repository<Category>) {
    super(categoryService);
  }
}

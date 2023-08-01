import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { BasePaginationResponse, BaseResponse } from 'src/common/dtos/base.dto';
import { OrderEnum } from 'src/common/enums/order.enum';
import { SearchService } from 'src/search/search.service';
import { ISearchListFieldQuery } from 'src/sub-field/dtos/search-list-field.dto';
import { In } from 'typeorm';
import { CreateFieldDto } from './dtos/create-field.dto';
import { IFieldQuery } from './dtos/query-field.dto';
import { UpdateFieldDto } from './dtos/update-field.dto';
import { Field } from './entities/field.entity';
import { FieldService } from './field.service';
import { FieldSearchBody } from './types/field-search.interface';

@ApiTags('Field')
@Controller('fields')
export class FieldController {
  constructor(private readonly fieldService: FieldService, private readonly searchService: SearchService) {}

  @ApiResponse({
    description: 'Get field successfully',
    type: BasePaginationResponse<Field>,
  })
  @Get()
  @ResponseMessage('Get field successfully')
  async findAll(@Query() query: IFieldQuery) {
    const relations = ['subFields'];

    const keyword = query.keyword;
    const order = query.order || OrderEnum.Desc;

    if (keyword) {
      const ids = await this.searchService.search<FieldSearchBody>('fields', keyword, [
        'name',
        'description',
        'district',
        'province',
      ]);
      return this.fieldService.findAndCount(query, {
        where: {
          _id: In(ids),
        },
        order: { name: order },
        relations,
      });
    }
    return this.fieldService.findAndCount(query, {
      order: { name: order },
      relations,
    });
  }

  @ApiResponse({
    description: 'Search fields successfully',
    type: BasePaginationResponse<Field>,
  })
  @ResponseMessage('Search fields successfully')
  @Get('/search')
  async search(@Query() query: ISearchListFieldQuery) {
    const location = query.location;

    const ids = await this.searchService.search<FieldSearchBody>('fields', location, [
      'name',
      'description',
      'district',
      'province',
    ]);

    return this.fieldService.searchListFields(query, ids);
  }

  @Get(':id')
  @ResponseMessage('Field founded successfully')
  async findOne(@Param('id') id: string) {
    const data = await this.fieldService.findOne({
      where: {
        _id: id,
      },
      relations: {
        subFields: {
          category: true,
        },
      },
    });

    if (!data) {
      throw new NotFoundException('Field not found');
    }
    return { data };
  }

  @Get(':slug')
  @ResponseMessage('Field founded successfully')
  async findBySlug(@Param('slug') slug: string) {
    const data = await this.fieldService.findOne({
      where: {
        slug,
      },
      relations: {
        subFields: {
          category: true,
        },
      },
    });

    if (!data) {
      throw new NotFoundException('Field not found');
    }
    return { data };
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create field successfully',
    type: BaseResponse<Field>,
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  @ResponseMessage('Create field successfully')
  async create(@Body() createFieldDto: CreateFieldDto) {
    const data = await this.fieldService.create(createFieldDto);

    const { _id, name, description, district, province } = data;
    this.searchService.index<FieldSearchBody>('fields', {
      id: _id,
      name,
      description,
      province,
      district,
    });

    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateFieldDto: UpdateFieldDto) {
    const data = await this.fieldService.update(id, updateFieldDto);

    return { data };
  }

  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id') id: string) {
    this.fieldService.softDelete(id);
  }
}

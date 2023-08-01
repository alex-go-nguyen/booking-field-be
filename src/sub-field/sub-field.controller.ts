import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { IPagination } from 'src/common/dtos/pagination.dto';
import { OrderEnum } from 'src/common/enums/order.enum';
import { CreateSubFieldDto } from './dtos/create-sub-field.dto';
import { SubFieldService } from './sub-field.service';

@ApiTags('Sub-field')
@Controller('sub-fields')
export class SubFieldController {
  constructor(private readonly subFieldService: SubFieldService) {}

  @ResponseMessage('Get all subfields successfully')
  @Get()
  async findAll(@Query() query: IPagination) {
    const relations = ['field', 'category'];
    const order = query.order || OrderEnum.Asc;

    return this.subFieldService.findAndCount(query, {
      order: { no: order },
      relations,
    });
  }

  @Get('field/:fieldId')
  async findInField(@Param('fieldId') fieldId: string) {
    const data = await this.subFieldService.findInField(fieldId);

    return { data };
  }

  @ResponseMessage('Get subfield successfully')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.subFieldService.findOne({
      where: {
        _id: id,
      },
    });

    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Create subfield successfully')
  @Post()
  create(@Body() createSubFieldDto: CreateSubFieldDto) {
    return this.subFieldService.create(createSubFieldDto);
  }

  // @UseGuards(JwtAuthGuard)
  // @ResponseMessage('Update subfield successfully')
  // @Put(':id')
  // async update(@Param('id') id: string, @Body() updateSubFieldDto: UpdateSubFieldDto) {
  //   const data = await this.subFieldService.update(id, updateSubFieldDto);

  //   return { data };
  // }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.subFieldService.softDelete(id);
  }
}

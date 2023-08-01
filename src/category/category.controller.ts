import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ERole } from 'src/common/enums/role.enum';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-booking.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ResponseMessage('Get categories successfully')
  @Get()
  async findAll() {
    const data = await this.categoryService.findAll();

    return { data };
  }

  @ResponseMessage('Get category successfully')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.categoryService.findOne({
      where: {
        _id: id,
      },
    });

    return { data };
  }

  @ResponseMessage('Create booking successfully')
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const data = await this.categoryService.create(createCategoryDto);

    return { data };
  }

  @ResponseMessage('Update booking successfully')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.Admin)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    const data = await this.categoryService.update(id, updateCategoryDto);

    return { data };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ERole.Admin)
  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.categoryService.softDelete(id);
  }
}

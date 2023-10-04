import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/auth/roles.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleEnum } from 'src/common/enums/role.enum';
import { CreatePitchCategoryDto } from './dtos/create-pitch-category.dto';
import { GetPitchCategoriesQuery } from './dtos/pitch-category-query.dto';
import { UpdatePitchCategoryDto } from './dtos/update-pitch-category.dto';
import { PitchCategoryService } from './pitch-category.service';

@ApiTags('Pitch Category')
@Controller('pitch-categories')
export class PitchCategoryController {
  constructor(private readonly pitchCategoryService: PitchCategoryService) {}

  @ResponseMessage('Get pitch categories successfully')
  @Get()
  findAll(@Query() query: GetPitchCategoriesQuery) {
    return this.pitchCategoryService.findAllPitchCategories(query);
  }

  @ResponseMessage('Get pitch category successfully')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.pitchCategoryService.findById(id);
  }

  @ResponseMessage('Create pitch category successfully')
  @Roles(RoleEnum.Admin)
  @UseGuards(RoleGuard)
  @Post()
  create(@Body() createPitchCategoryDto: CreatePitchCategoryDto) {
    return this.pitchCategoryService.create(createPitchCategoryDto);
  }

  @ResponseMessage('Update pitch category successfully')
  @Roles(RoleEnum.Admin)
  @UseGuards(RoleGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() updatePitchCategoryDto: UpdatePitchCategoryDto) {
    return this.pitchCategoryService.update(id, updatePitchCategoryDto);
  }

  @HttpCode(204)
  @Roles(RoleEnum.Admin)
  @UseGuards(RoleGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.pitchCategoryService.softDelete(id);
  }
}

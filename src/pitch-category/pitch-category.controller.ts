import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/auth/roles.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { BaseQuery } from 'src/common/dtos/query.dto';
import { RoleEnum } from 'src/common/enums/role.enum';
import { CreatePitchCategoryDto } from './dtos/create-pitch-category.dto';
import { UpdatePitchCategoryDto } from './dtos/update-pitch-category.dto';
import { PitchCategoryService } from './pitch-category.service';

@ApiTags('Pitch Category')
@Controller('pitch-categories')
export class PitchCategoryController {
  constructor(private readonly pitchCategoryService: PitchCategoryService) {}

  @ResponseMessage('Get pitch categories successfully')
  @Get()
  findAll(@Query() query: BaseQuery) {
    return this.pitchCategoryService.findAndCount(query);
  }

  @ResponseMessage('Get pitch category successfully')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.pitchCategoryService.findOne({
      where: {
        id,
      },
    });

    return { data };
  }

  @ResponseMessage('Create pitch category successfully')
  @Roles(RoleEnum.Admin)
  @UseGuards(RoleGuard)
  @Post()
  async create(@Body() createPitchCategoryDto: CreatePitchCategoryDto) {
    const data = await this.pitchCategoryService.create(createPitchCategoryDto);

    return { data };
  }

  @ResponseMessage('Update pitch category successfully')
  @Roles(RoleEnum.Admin)
  @UseGuards(RoleGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updatePitchCategoryDto: UpdatePitchCategoryDto) {
    const data = await this.pitchCategoryService.update(id, updatePitchCategoryDto);

    return { data };
  }

  @HttpCode(204)
  @Roles(RoleEnum.Admin)
  @UseGuards(RoleGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.pitchCategoryService.softDelete(id);
  }
}

import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
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
        _id: id,
      },
    });

    return { data };
  }

  @ResponseMessage('Create pitch category successfully')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.Admin)
  @Post()
  async create(@Body() createPitchCategoryDto: CreatePitchCategoryDto) {
    const data = await this.pitchCategoryService.create(createPitchCategoryDto);

    return { data };
  }

  @ResponseMessage('Update pitch category successfully')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.Admin)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updatePitchCategoryDto: UpdatePitchCategoryDto) {
    const data = await this.pitchCategoryService.update(id, updatePitchCategoryDto);

    return { data };
  }

  @HttpCode(204)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.Admin)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.pitchCategoryService.softDelete(id);
  }
}

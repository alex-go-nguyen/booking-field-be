import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { IPagination } from 'src/common/dtos/pagination.dto';
import { OrderEnum } from 'src/common/enums/order.enum';
import { CreatePitchDto } from './dtos/create-pitch.dto';
import { FindPitchQueryDto } from './dtos/find-pitch.dto';
import { UpdatePitchDto } from './dtos/update-pitch.dto';
import { PitchService } from './pitch.service';

@ApiTags('Pitch')
@Controller('pitches')
export class PitchController {
  constructor(private readonly pitchService: PitchService) {}

  @ResponseMessage('Get all pitches successfully')
  @Get()
  async findAll(@Query() query: IPagination) {
    const relations = ['venue', 'pitchCategory'];
    const order = query.order || OrderEnum.Asc;

    return this.pitchService.findAndCount(query, {
      order: { no: order },
      relations,
    });
  }

  @ResponseMessage('Get pitch by venue detail page successfully')
  @Get('venue-detail/:venueId')
  async findInVenueDetail(@Param('venueId') venueId: number) {
    const data = await this.pitchService.findInVenueDetail(venueId);

    return { data };
  }

  @ResponseMessage('Get pitch by venue successfully')
  @Get('venue/:venueId')
  async findByVenue(@Param('venueId') venueId: number, @Query() query: FindPitchQueryDto) {
    const relations = ['venue', 'pitchCategory'];

    const { pitchCategoryId } = query;

    const data = await this.pitchService.findAll({
      where: {
        venue: {
          _id: venueId,
        },
        pitchCategory: {
          _id: pitchCategoryId,
        },
      },
      relations,
    });

    return { data };
  }

  @ResponseMessage('Get pitch successfully')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.pitchService.findOne({
      where: {
        _id: id,
      },
    });

    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Create pitch successfully')
  @Post()
  create(@Body() createPitchDto: CreatePitchDto) {
    return this.pitchService.create(createPitchDto);
  }

  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Update pitch successfully')
  @Put(':id')
  async update(@Param('id') id: number, @Body() updatePitchDto: UpdatePitchDto) {
    const data = await this.pitchService.update(id, updatePitchDto);

    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.pitchService.softDelete(id);
  }
}

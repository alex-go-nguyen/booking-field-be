import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { Pagination } from 'src/common/dtos/pagination.dto';
import { BaseQuery } from 'src/common/dtos/query.dto';
import { CreateRatingDto } from './dtos/create-rating.dto';
import { UpdateRatingDto } from './dtos/update-rating.dto';
import { Rating } from './entities/rating.entity';
import { RatingService } from './rating.service';

@ApiTags('Rating')
@Controller('ratings')
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @ApiResponse({
    description: 'Get ratings successfully',
    type: BasePaginationResponse<Rating>,
  })
  @ResponseMessage('Get ratings successfully')
  @Get()
  async findAll(@Query() query: BaseQuery) {
    const data = await this.ratingService.findMany(query);

    return { data };
  }

  @ApiResponse({
    description: 'Get rating successfully',
    type: BaseResponse<Rating>,
  })
  @ResponseMessage('Get rating successfully')
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const data = await this.ratingService.findOne({
      where: {
        _id: id,
      },
    });

    return { data };
  }

  @ApiResponse({
    description: 'Get ratings by venue successfully',
    type: BasePaginationResponse<Rating[]>,
  })
  @ResponseMessage('Get ratings by venue successfully')
  @Get('venue/:venueId')
  findByVenue(@Param('venueId') venueId: number, @Query() query: Pagination) {
    return this.ratingService.findByVenue(venueId, query);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create rating successfully',
    type: BaseResponse<Rating>,
  })
  @ResponseMessage('Create rating successfully')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createRatingDto: CreateRatingDto) {
    const data = await this.ratingService.create(createRatingDto);

    return { data };
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update rating successfully',
    type: BaseResponse<Rating>,
  })
  @ResponseMessage('Update rating successfully')
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateRatingDto: UpdateRatingDto) {
    const data = await this.ratingService.update(id, updateRatingDto);

    return { data };
  }

  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    this.ratingService.softDelete(id);
  }
}

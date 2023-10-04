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
import { CreateRatingDto } from './dtos/create-rating.dto';
import { GetRatingQuery } from './dtos/rating-query.dto';
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
  findAll(@Query() query: GetRatingQuery) {
    return this.ratingService.findAllRating(query);
  }

  @ApiResponse({
    description: 'Get rating successfully',
    type: BaseResponse<Rating>,
  })
  @ResponseMessage('Get rating successfully')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.ratingService.findById(id);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create rating successfully',
    type: BaseResponse<Rating>,
  })
  @ResponseMessage('Create rating successfully')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createRatingDto: CreateRatingDto) {
    return this.ratingService.create(createRatingDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update rating successfully',
    type: BaseResponse<Rating>,
  })
  @ResponseMessage('Update rating successfully')
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() updateRatingDto: UpdateRatingDto) {
    return this.ratingService.update(id, updateRatingDto);
  }

  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.ratingService.softDelete(id);
  }
}

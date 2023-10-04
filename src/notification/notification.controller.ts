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
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { BaseResponse } from 'src/common/dtos/base.dto';
import { CurrentUser } from 'src/user/user.decorator';
import { CreateNotificationDto } from './dtos/create-notification.dto';
import { GetNotificationsQuery } from './dtos/notification-query.dto';
import { UpdateNotificationDto } from './dtos/update-notification.dto';
import { Notification } from './entities/notification.entity';
import { NotificationService } from './notification.service';

@ApiTags('Notification')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notifcationService: NotificationService) {}

  @ApiOkResponse({
    description: 'Get all notifications successfully!',
    type: [Notification],
  })
  @ResponseMessage('Get all notifications successfully')
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query() query: GetNotificationsQuery, @CurrentUser('id') userId: number) {
    return this.notifcationService.findAllNotifications(query, userId);
  }

  @ApiOkResponse({
    description: 'Get notification successfully!',
    type: Notification,
  })
  @ResponseMessage('Get notification successfully')
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.notifcationService.findById(id);
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create notification successfully',
    type: BaseResponse<Notification>,
  })
  @ResponseMessage('Create notification successfully')
  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notifcationService.create(createNotificationDto);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update notification successfully',
    type: BaseResponse<Notification>,
  })
  @ResponseMessage('Update notification successfully')
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() updateNotificationDto: UpdateNotificationDto) {
    return this.notifcationService.update(id, updateNotificationDto);
  }

  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.notifcationService.softDelete(id);
  }
}

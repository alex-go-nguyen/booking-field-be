import { PartialType } from '@nestjs/swagger';
import { Notification } from '../entities/notification.entity';

export class UpdateNotificationDto extends PartialType(Notification) {}

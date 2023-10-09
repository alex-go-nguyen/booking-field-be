import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/common/services/base.service';
import { Repository } from 'typeorm';
import { GetNotificationsQuery } from './dtos/notification-query.dto';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService extends BaseService<Notification, unknown> {
  constructor(@InjectRepository(Notification) private notificationRepository: Repository<Notification>) {
    super(notificationRepository);
  }

  findAllNotifications(query: GetNotificationsQuery) {
    return this.findAndCount(query);
  }

  findById(id: number) {
    return this.findOne({
      where: {
        id,
      },
    });
  }

  findByCurrentUser(query: GetNotificationsQuery, userId: number) {
    return this.findAndCount(query, {
      where: {
        ...(userId && {
          user: {
            id: userId,
          },
        }),
      },
    });
  }

  countNotSeen(userId: number) {
    const qb = this.notificationRepository
      .createQueryBuilder('n')
      .select('COUNT(*)', 'countNotSeen')
      .where('n."userId" = :userId', { userId })
      .andWhere('n."isSeen" = false');

    return qb.getRawOne();
  }

  bulkUpdateSeenStatus(userId: number) {
    const qb = this.notificationRepository
      .createQueryBuilder('n')
      .update(Notification)
      .set({ isSeen: true })
      .where('userId = :userId', { userId });

    return qb.execute();
  }
}

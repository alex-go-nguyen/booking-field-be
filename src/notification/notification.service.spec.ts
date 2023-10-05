import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetNotificationsQuery } from './dtos/notification-query.dto';
import { Notification } from './entities/notification.entity';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let notificationRepository: Repository<Notification>;

  const mockNotificationRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getRepositoryToken(Notification),
          useValue: mockNotificationRepository,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    notificationRepository = module.get<Repository<Notification>>(getRepositoryToken(Notification));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllNotification', () => {
    it('should find and count notifications with given query', async () => {
      const query: GetNotificationsQuery = {
        page: 1,
        limit: 0,
      };

      const notifications = [{ id: 1 }, { id: 2 }];
      const userId = 1;
      const totalCount = 2;

      mockNotificationRepository.findAndCount.mockResolvedValue([notifications, totalCount]);

      const result = await service.findAllNotifications(query, userId);

      expect(mockNotificationRepository.findAndCount).toHaveBeenCalledWith({
        take: 0,
        skip: 0,
        order: {},
        where: {
          user: {
            id: userId,
          },
        },
      });
      expect(result).toEqual({
        data: notifications,
        pageInfo: {
          count: 2,
          page: 1,
          pageCount: 1,
          pageSize: 2,
        },
      });
    });

    it('should find and count all notifications when no query provided', async () => {
      const query = {} as GetNotificationsQuery;

      const notifcations = [{ id: 1 }, { id: 2 }];
      const totalCount = 2;
      const userId = 1;

      mockNotificationRepository.findAndCount.mockResolvedValue([notifcations, totalCount]);

      const result = await service.findAllNotifications(query, userId);

      expect(mockNotificationRepository.findAndCount).toHaveBeenCalledWith({
        take: 0,
        skip: 0,
        order: {},
        where: {
          user: {
            id: userId,
          },
        },
      });
      expect(result).toEqual({
        data: notifcations,
        pageInfo: {
          count: 2,
          page: undefined,
          pageCount: 1,
          pageSize: 2,
        },
      });
    });
  });

  describe('findById', () => {
    it('should find a notification by ID', async () => {
      const notificationId = 1;
      const notification = { id: notificationId };

      mockNotificationRepository.findOne.mockResolvedValue(notification);

      const result = await service.findById(notificationId);

      expect(mockNotificationRepository.findOne).toHaveBeenCalledWith({ where: { id: notificationId } });
      expect(result).toEqual(notification);
    });

    it('should return null when no notification found with the given ID', async () => {
      const notificationId = 1;

      mockNotificationRepository.findOne.mockResolvedValue(null);

      const result = await service.findById(notificationId);

      expect(mockNotificationRepository.findOne).toHaveBeenCalledWith({ where: { id: notificationId } });
      expect(result).toBeNull();
    });
  });
});

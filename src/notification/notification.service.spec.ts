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
    createQueryBuilder: jest.fn(),
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

  describe('findByCurrentUser', () => {
    it('should find and count notifications with given query', async () => {
      const query: GetNotificationsQuery = {
        page: 1,
        limit: 0,
      };

      const notifications = [{ id: 1 }, { id: 2 }];
      const userId = 1;
      const totalCount = 2;

      mockNotificationRepository.findAndCount.mockResolvedValue([notifications, totalCount]);

      const result = await service.findByCurrentUser(query, userId);

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

      const result = await service.findByCurrentUser(query, userId);

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

  describe('countNotSeen', () => {
    it('should return the count of not seen notifications', async () => {
      const userId = 1;
      const expectedResult = { countNotSeen: 5 };

      jest.spyOn(mockNotificationRepository, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(expectedResult),
      });

      const result = await service.countNotSeen(userId);

      expect(result).toEqual(expectedResult);
      expect(notificationRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
      expect(notificationRepository.createQueryBuilder).toHaveBeenCalledWith('n');
      expect(notificationRepository.createQueryBuilder().select).toHaveBeenCalledWith('COUNT(*)', 'countNotSeen');
      expect(notificationRepository.createQueryBuilder().where).toHaveBeenCalledWith('n."userId" = :userId', {
        userId,
      });
      expect(notificationRepository.createQueryBuilder().andWhere).toHaveBeenCalledWith('n."isSeen" = false');
      expect(notificationRepository.createQueryBuilder().getRawOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('bulkUpdateSeenStatus', () => {
    it('should bulk update seen status for notifications', async () => {
      const userId = 1;
      const expectedResult = { affected: 5 }; // Replace with your expected affected count

      jest.spyOn(mockNotificationRepository, 'createQueryBuilder').mockReturnValue({
        update: jest.fn().mockReturnThis(),
        set: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue(expectedResult),
      });

      const result = await service.bulkUpdateSeenStatus(userId);

      expect(result).toEqual(expectedResult);
      expect(mockNotificationRepository.createQueryBuilder).toHaveBeenCalledTimes(6);
      expect(mockNotificationRepository.createQueryBuilder).toHaveBeenCalledWith('n');
      expect(mockNotificationRepository.createQueryBuilder().update).toHaveBeenCalledWith(Notification);
      expect(mockNotificationRepository.createQueryBuilder().set).toHaveBeenCalledWith({ isSeen: true });
      expect(mockNotificationRepository.createQueryBuilder().where).toHaveBeenCalledWith('userId = :userId', {
        userId,
      });
      expect(mockNotificationRepository.createQueryBuilder().execute).toHaveBeenCalledTimes(1);
    });
  });
});

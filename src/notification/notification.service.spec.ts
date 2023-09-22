import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';

const mockNotification = () => {
  return {
    id: 1,
    title: 'title',
    message: 'message',
  };
};

const mockNotifications = () => {
  return [
    {
      id: 1,
      title: 'title',
      message: 'message',
    },
    {
      id: 2,
      title: 'title',
      message: 'message',
    },
    {
      id: 3,
      title: 'title',
      message: 'message',
    },
    {
      id: 4,
      title: 'title',
      message: 'message',
    },
  ];
};

const notificationServiceMock: Partial<NotificationService> = {
  findOne: jest.fn().mockResolvedValue(mockNotification()),
  findAll: jest.fn().mockResolvedValue(mockNotifications()),
};

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationService, { provide: NotificationService, useValue: notificationServiceMock }],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMatch', () => {
    it('should return notification', async () => {
      const result = {
        id: 1,
        title: 'title',
        message: 'message',
      };

      notificationServiceMock.findOne = jest.fn().mockResolvedValue(result);

      await expect(
        service.findOne({
          where: {
            id: 1,
          },
        }),
      ).resolves.toEqual(result);
    });
  });

  describe('getAllMatchOfTournament', () => {
    it('should return array of team', async () => {
      const results = [
        {
          id: 1,
          title: 'title',
          message: 'message',
        },
        {
          id: 2,
          title: 'title',
          message: 'message',
        },
        {
          id: 3,
          title: 'title',
          message: 'message',
        },
        {
          id: 4,
          title: 'title',
          message: 'message',
        },
      ];

      notificationServiceMock.findAll = jest.fn().mockResolvedValue(results);

      await expect(service.findAll()).resolves.toEqual(results);
    });
  });
});

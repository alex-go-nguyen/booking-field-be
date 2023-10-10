import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForgottenPassword } from 'src/user/entities/forgotten-password.entity';
import { Repository } from 'typeorm';
import { ForgottenPasswordService } from './forgotten-password.service';

describe('ForgottenPasswordService', () => {
  let service: ForgottenPasswordService;
  let repository: Repository<ForgottenPassword>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForgottenPasswordService,
        {
          provide: getRepositoryToken(ForgottenPassword),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ForgottenPasswordService>(ForgottenPasswordService);
    repository = module.get<Repository<ForgottenPassword>>(getRepositoryToken(ForgottenPassword));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getForgottenPasswordModel', () => {
    it('should find a forgotten password by reset token', async () => {
      const resetToken = 'some-reset-token';
      const mockForgottenPassword = new ForgottenPassword();

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockForgottenPassword);

      const result = await service.getForgottenPasswordModel(resetToken);

      expect(result).toBe(mockForgottenPassword);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: {
          resetToken,
        },
      });
    });

    it('should return null if no forgotten password is found', async () => {
      const resetToken = 'non-existent-reset-token';

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await service.getForgottenPasswordModel(resetToken);

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith({
        where: {
          resetToken,
        },
      });
    });
  });

  describe('remove', () => {
    it('should remove a forgotten password', async () => {
      const mockForgottenPassword = new ForgottenPassword();

      jest.spyOn(repository, 'remove').mockResolvedValue(mockForgottenPassword);

      const result = await service.remove(mockForgottenPassword);

      expect(result).toBe(mockForgottenPassword);
      expect(repository.remove).toHaveBeenCalledWith(mockForgottenPassword);
    });
  });
});

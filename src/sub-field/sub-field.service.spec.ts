import { Test, TestingModule } from '@nestjs/testing';
import { SubFieldService } from './sub-field.service';

describe('SubFieldService', () => {
  let service: SubFieldService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubFieldService],
    }).compile();

    service = module.get<SubFieldService>(SubFieldService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

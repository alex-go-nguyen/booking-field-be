import { Test, TestingModule } from '@nestjs/testing';
import { SubFieldController } from './sub-field.controller';

describe('SubFieldController', () => {
  let controller: SubFieldController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubFieldController],
    }).compile();

    controller = module.get<SubFieldController>(SubFieldController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

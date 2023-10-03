import { Test, TestingModule } from '@nestjs/testing';
import { StripeService } from './stripe.service';

const stripeServiceMock = {};

describe('TournamentService', () => {
  let service: StripeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StripeService, { provide: StripeService, useValue: stripeServiceMock }],
    }).compile();

    service = module.get<StripeService>(StripeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

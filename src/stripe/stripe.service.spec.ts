import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import User from 'src/user/entities/user.entity';
import Stripe from 'stripe';
import { CreatePaymentIntentDto } from './dtos/create-payment-intent.dto';
import { StripeService } from './stripe.service';

describe('StripeService', () => {
  let service: StripeService;
  let configService: ConfigService;
  let stripe: Stripe;

  beforeEach(async () => {
    const stripeModule: TestingModule = await Test.createTestingModule({
      providers: [
        StripeService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'your-stripe-secret-key'),
          },
        },
      ],
    }).compile();

    service = stripeModule.get<StripeService>(StripeService);
    configService = stripeModule.get<ConfigService>(ConfigService);
    stripe = service['stripe'];
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCustomer', () => {
    it('should create a customer', async () => {
      const mockCustomer = {
        id: 'customer-id',
        name: 'John Doe',
        email: 'john@example.com',
      } as Stripe.Response<Stripe.Customer>;
      jest.spyOn(stripe.customers, 'create').mockResolvedValue(mockCustomer);

      const result = await service.createCustomer('John Doe', 'john@example.com');

      expect(result).toEqual(mockCustomer);
      expect(stripe.customers.create).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
      });
    });
  });

  describe('createPaymentIntent', () => {
    it('should create a payment intent', async () => {
      const createPaymentIntentDto: CreatePaymentIntentDto = {
        currency: 'usd',
        amount: 1000,
      };
      const mockPaymentIntent = {
        id: 'payment-intent-id',
        client_secret: 'client-secret-key',
      } as Stripe.Response<Stripe.PaymentIntent>;

      jest.spyOn(stripe.paymentIntents, 'create').mockResolvedValue(mockPaymentIntent);

      const result = await service.createPaymentIntent(createPaymentIntentDto);

      expect(result).toEqual({ clientSecret: 'client-secret-key' });
      expect(stripe.paymentIntents.create).toHaveBeenCalledWith({
        currency: 'usd',
        amount: 1000,
        automatic_payment_methods: { enabled: true },
      });
    });
  });
});

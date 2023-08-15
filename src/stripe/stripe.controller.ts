import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePaymentIntentDto } from './dtos/create-payment-intent.dto';
import { StripeService } from './stripe.service';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  createPaymentIntent(@Body() createPaymentIntentDto: CreatePaymentIntentDto) {
    return this.stripeService.createPaymentIntent(createPaymentIntentDto);
  }
}

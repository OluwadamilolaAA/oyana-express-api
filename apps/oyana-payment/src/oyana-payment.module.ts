import { Module } from '@nestjs/common';
import { OyanaPaymentController } from './oyana-payment.controller';
import { paymentProviders } from './provider/payment.providers';
import { OyanaPaymentService } from './oyana-payment.service';

@Module({
  imports: [],
  controllers: [OyanaPaymentController],
  providers: [...paymentProviders, OyanaPaymentService],
})
export class OyanaPaymentModule {}

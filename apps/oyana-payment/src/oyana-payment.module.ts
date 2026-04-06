import { Module } from '@nestjs/common';
import { OyanaPaymentController } from './oyana-payment.controller';
import { OyanaPaymentService } from './oyana-payment.service';

@Module({
  imports: [],
  controllers: [OyanaPaymentController],
  providers: [OyanaPaymentService],
})
export class OyanaPaymentModule {}

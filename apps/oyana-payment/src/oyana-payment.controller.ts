import { Controller, Get } from '@nestjs/common';
import { OyanaPaymentService } from './oyana-payment.service';

@Controller()
export class OyanaPaymentController {
  constructor(private readonly oyanaPaymentService: OyanaPaymentService) {}

  @Get()
  getHello(): string {
    return this.oyanaPaymentService.getHello();
  }
}

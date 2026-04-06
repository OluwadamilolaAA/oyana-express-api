import { Controller, Get } from '@nestjs/common';
import { OyanaDeliveryService } from './oyana-delivery.service';

@Controller()
export class OyanaDeliveryController {
  constructor(private readonly oyanaDeliveryService: OyanaDeliveryService) {}

  @Get()
  getOverview() {
    return this.oyanaDeliveryService.getOverview();
  }
}

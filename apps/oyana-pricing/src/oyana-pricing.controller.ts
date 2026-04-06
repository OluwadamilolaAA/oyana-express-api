import { Controller, Get } from '@nestjs/common';
import { OyanaPricingService } from './oyana-pricing.service';

@Controller()
export class OyanaPricingController {
  constructor(private readonly oyanaPricingService: OyanaPricingService) {}

  @Get()
  getHello(): string {
    return this.oyanaPricingService.getHello();
  }
}

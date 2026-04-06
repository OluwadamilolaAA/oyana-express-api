import { Controller, Get } from '@nestjs/common';
import { OyanaRideService } from './oyana-ride.service';

@Controller()
export class OyanaRideController {
  constructor(private readonly oyanaRideService: OyanaRideService) {}

  @Get()
  getHello(): string {
    return this.oyanaRideService.getHello();
  }
}

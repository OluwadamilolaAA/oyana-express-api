import { Controller, Get } from '@nestjs/common';
import { OyanaFreightService } from './oyana-freight.service';

@Controller()
export class OyanaFreightController {
  constructor(private readonly oyanaFreightService: OyanaFreightService) {}

  @Get()
  getHello(): string {
    return this.oyanaFreightService.getHello();
  }
}

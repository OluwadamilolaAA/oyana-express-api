import { Controller, Get } from '@nestjs/common';
import { OyanaDriverService } from './oyana-driver.service';

@Controller()
export class OyanaDriverController {
  constructor(private readonly oyanaDriverService: OyanaDriverService) {}

  @Get()
  getHello(): string {
    return this.oyanaDriverService.getHello();
  }
}

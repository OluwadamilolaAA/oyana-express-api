import { Controller, Get } from '@nestjs/common';
import { OyanaLocationService } from './oyana-location.service';

@Controller()
export class OyanaLocationController {
  constructor(private readonly oyanaLocationService: OyanaLocationService) {}

  @Get()
  getHello(): string {
    return this.oyanaLocationService.getHello();
  }
}

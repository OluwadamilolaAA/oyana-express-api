import { Controller, Get } from '@nestjs/common';
import { OyanaDispatchService } from './oyana-dispatch.service';

@Controller()
export class OyanaDispatchController {
  constructor(private readonly oyanaDispatchService: OyanaDispatchService) {}

  @Get()
  getHello(): string {
    return this.oyanaDispatchService.getHello();
  }
}

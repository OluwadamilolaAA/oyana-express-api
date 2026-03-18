import { Controller, Get } from '@nestjs/common';
import { OyanaUserService } from './oyana-user.service';

@Controller()
export class OyanaUserController {
  constructor(private readonly oyanaUserService: OyanaUserService) {}

  @Get()
  getHello(): string {
    return this.oyanaUserService.getHello();
  }
}

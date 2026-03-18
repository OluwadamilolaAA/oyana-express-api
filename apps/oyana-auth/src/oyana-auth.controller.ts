import { Controller, Get } from '@nestjs/common';
import { OyanaAuthService } from './oyana-auth.service';

@Controller()
export class OyanaAuthController {
  constructor(private readonly oyanaAuthService: OyanaAuthService) {}

  @Get()
  getHello(): string {
    return this.oyanaAuthService.getHello();
  }
}

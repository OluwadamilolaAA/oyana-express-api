import { Controller, Get } from '@nestjs/common';
import { OyanaAdminService } from './oyana-admin.service';

@Controller()
export class OyanaAdminController {
  constructor(private readonly oyanaAdminService: OyanaAdminService) {}

  @Get()
  getHello(): string {
    return this.oyanaAdminService.getHello();
  }
}

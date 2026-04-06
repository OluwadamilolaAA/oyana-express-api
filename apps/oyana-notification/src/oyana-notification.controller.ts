import { Controller, Get } from '@nestjs/common';
import { OyanaNotificationService } from './oyana-notification.service';

@Controller()
export class OyanaNotificationController {
  constructor(private readonly oyanaNotificationService: OyanaNotificationService) {}

  @Get()
  getHello(): string {
    return this.oyanaNotificationService.getHello();
  }
}

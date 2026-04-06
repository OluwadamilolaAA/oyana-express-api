import { Controller, Get } from '@nestjs/common';
import { OyanaChatService } from './oyana-chat.service';

@Controller()
export class OyanaChatController {
  constructor(private readonly oyanaChatService: OyanaChatService) {}

  @Get()
  getHello(): string {
    return this.oyanaChatService.getHello();
  }
}

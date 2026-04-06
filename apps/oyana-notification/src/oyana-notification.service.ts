import { Injectable } from '@nestjs/common';

@Injectable()
export class OyanaNotificationService {
  getHello(): string {
    return 'Hello World!';
  }
}

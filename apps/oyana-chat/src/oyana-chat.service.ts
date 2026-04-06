import { Injectable } from '@nestjs/common';

@Injectable()
export class OyanaChatService {
  getHello(): string {
    return 'Hello World!';
  }
}

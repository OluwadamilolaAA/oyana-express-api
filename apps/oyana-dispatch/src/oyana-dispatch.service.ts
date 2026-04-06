import { Injectable } from '@nestjs/common';

@Injectable()
export class OyanaDispatchService {
  getHello(): string {
    return 'Hello World!';
  }
}

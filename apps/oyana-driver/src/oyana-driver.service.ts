import { Injectable } from '@nestjs/common';

@Injectable()
export class OyanaDriverService {
  getHello(): string {
    return 'Hello World!';
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class OyanaLocationService {
  getHello(): string {
    return 'Hello World!';
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class OyanaUserService {
  getHello(): string {
    return 'Hello World!';
  }
}

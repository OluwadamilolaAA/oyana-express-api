import { Injectable } from '@nestjs/common';

@Injectable()
export class OyanaAuthService {
  getHello(): string {
    return 'Hello World!';
  }
}

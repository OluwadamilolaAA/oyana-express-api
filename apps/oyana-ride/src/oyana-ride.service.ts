import { Injectable } from '@nestjs/common';

@Injectable()
export class OyanaRideService {
  getHello(): string {
    return 'Hello World!';
  }
}

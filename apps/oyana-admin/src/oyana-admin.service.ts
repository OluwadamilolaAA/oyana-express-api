import { Injectable } from '@nestjs/common';

@Injectable()
export class OyanaAdminService {
  getHello(): string {
    return 'Hello World!';
  }
}

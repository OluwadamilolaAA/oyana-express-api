import {
  Controller,
  Get,
  Inject,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { DataSource } from 'typeorm';

@Controller()
export class HealthController {
  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {}

  @Get('health')
  getHealth() {
    if (!this.dataSource.isInitialized) {
      throw new ServiceUnavailableException({
        service: 'oyana-freight',
        status: 'error',
        database: 'down',
        timestamp: new Date().toISOString(),
      });
    }

    return {
      service: 'oyana-freight',
      status: 'ok',
      database: 'up',
      timestamp: new Date().toISOString(),
    };
  }
}

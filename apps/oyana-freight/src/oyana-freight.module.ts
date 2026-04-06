import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { HealthController } from './health.controller';
import { OyanaFreightController } from './oyana-freight.controller';
import { freightProviders } from './provider/freight.providers';
import { OyanaFreightService } from './oyana-freight.service';

@Module({
  imports: [DatabaseModule],
  controllers: [OyanaFreightController, HealthController],
  providers: [...freightProviders, OyanaFreightService],
})
export class OyanaFreightModule {}

import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { HealthController } from './health.controller';
import { OyanaFreightController } from './oyana-freight.controller';
import { OyanaFreightService } from './oyana-freight.service';

@Module({
  imports: [DatabaseModule],
  controllers: [OyanaFreightController, HealthController],
  providers: [OyanaFreightService],
})
export class OyanaFreightModule {}

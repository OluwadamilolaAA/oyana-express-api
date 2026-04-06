import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { HealthController } from './health.controller';
import { OyanaDeliveryController } from './oyana-delivery.controller';
import { deliveryProviders } from './provider/delivery.providers';
import { OyanaDeliveryService } from './oyana-delivery.service';

@Module({
  imports: [DatabaseModule],
  controllers: [OyanaDeliveryController, HealthController],
  providers: [...deliveryProviders, OyanaDeliveryService],
})
export class OyanaDeliveryModule {}

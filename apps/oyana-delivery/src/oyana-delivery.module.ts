import { Module } from '@nestjs/common';
import { OyanaDeliveryController } from './oyana-delivery.controller';
import { OyanaDeliveryService } from './oyana-delivery.service';

@Module({
  imports: [],
  controllers: [OyanaDeliveryController],
  providers: [OyanaDeliveryService],
})
export class OyanaDeliveryModule {}

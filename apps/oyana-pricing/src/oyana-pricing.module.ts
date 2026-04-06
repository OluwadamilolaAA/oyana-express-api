import { Module } from '@nestjs/common';
import { OyanaPricingController } from './oyana-pricing.controller';
import { pricingProviders } from './provider/pricing.providers';
import { OyanaPricingService } from './oyana-pricing.service';

@Module({
  imports: [],
  controllers: [OyanaPricingController],
  providers: [...pricingProviders, OyanaPricingService],
})
export class OyanaPricingModule {}

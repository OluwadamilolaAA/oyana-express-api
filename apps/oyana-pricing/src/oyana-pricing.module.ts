import { Module } from '@nestjs/common';
import { OyanaPricingController } from './oyana-pricing.controller';
import { OyanaPricingService } from './oyana-pricing.service';

@Module({
  imports: [],
  controllers: [OyanaPricingController],
  providers: [OyanaPricingService],
})
export class OyanaPricingModule {}

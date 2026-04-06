import { Module } from '@nestjs/common';
import { OyanaRideController } from './oyana-ride.controller';
import { OyanaRideService } from './oyana-ride.service';

@Module({
  imports: [],
  controllers: [OyanaRideController],
  providers: [OyanaRideService],
})
export class OyanaRideModule {}

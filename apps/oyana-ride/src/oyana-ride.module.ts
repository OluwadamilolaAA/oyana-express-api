import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { HealthController } from './health.controller';
import { OyanaRideController } from './oyana-ride.controller';
import { rideProviders } from './provider/ride.providers';
import { OyanaRideService } from './oyana-ride.service';

@Module({
  imports: [DatabaseModule],
  controllers: [OyanaRideController, HealthController],
  providers: [...rideProviders, OyanaRideService],
})
export class OyanaRideModule {}

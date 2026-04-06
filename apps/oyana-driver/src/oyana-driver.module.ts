import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { OyanaDriverController } from './oyana-driver.controller';
import { OyanaDriverService } from './oyana-driver.service';
import { DatabaseModule } from './database.module';
import { driverProviders } from './provider/driver.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [OyanaDriverController, HealthController],
  providers: [...driverProviders, OyanaDriverService],
})
export class OyanaDriverModule {}

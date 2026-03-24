import { Module } from '@nestjs/common';
import { OyanaDriverController } from './oyana-driver.controller';
import { OyanaDriverService } from './oyana-driver.service';
import { DatabaseModule } from './database.module';
import { driverProviders } from './driver.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [OyanaDriverController],
  providers: [...driverProviders, OyanaDriverService],
})
export class OyanaDriverModule {}

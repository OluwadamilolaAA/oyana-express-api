import { Module } from '@nestjs/common';
import { OyanaDriverController } from './oyana-driver.controller';
import { OyanaDriverService } from './oyana-driver.service';

@Module({
  imports: [],
  controllers: [OyanaDriverController],
  providers: [OyanaDriverService],
})
export class OyanaDriverModule {}

import { Module } from '@nestjs/common';
import { OyanaLocationController } from './oyana-location.controller';
import { locationProviders } from './provider/location.providers';
import { OyanaLocationService } from './oyana-location.service';

@Module({
  imports: [],
  controllers: [OyanaLocationController],
  providers: [...locationProviders, OyanaLocationService],
})
export class OyanaLocationModule {}

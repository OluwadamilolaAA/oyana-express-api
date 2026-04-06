import { Module } from '@nestjs/common';
import { OyanaLocationController } from './oyana-location.controller';
import { OyanaLocationService } from './oyana-location.service';

@Module({
  imports: [],
  controllers: [OyanaLocationController],
  providers: [OyanaLocationService],
})
export class OyanaLocationModule {}

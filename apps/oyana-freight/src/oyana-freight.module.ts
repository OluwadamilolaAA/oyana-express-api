import { Module } from '@nestjs/common';
import { OyanaFreightController } from './oyana-freight.controller';
import { OyanaFreightService } from './oyana-freight.service';

@Module({
  imports: [],
  controllers: [OyanaFreightController],
  providers: [OyanaFreightService],
})
export class OyanaFreightModule {}

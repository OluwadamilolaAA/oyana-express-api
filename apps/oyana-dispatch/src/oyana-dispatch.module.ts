import { Module } from '@nestjs/common';
import { OyanaDispatchController } from './oyana-dispatch.controller';
import { OyanaDispatchService } from './oyana-dispatch.service';

@Module({
  imports: [],
  controllers: [OyanaDispatchController],
  providers: [OyanaDispatchService],
})
export class OyanaDispatchModule {}

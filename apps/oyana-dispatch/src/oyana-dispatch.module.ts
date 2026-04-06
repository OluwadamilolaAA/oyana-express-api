import { Module } from '@nestjs/common';
import { OyanaDispatchController } from './oyana-dispatch.controller';
import { dispatchProviders } from './provider/dispatch.providers';
import { OyanaDispatchService } from './oyana-dispatch.service';

@Module({
  imports: [],
  controllers: [OyanaDispatchController],
  providers: [...dispatchProviders, OyanaDispatchService],
})
export class OyanaDispatchModule {}

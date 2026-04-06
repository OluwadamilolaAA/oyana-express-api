import { Module } from '@nestjs/common';
import { OyanaNotificationController } from './oyana-notification.controller';
import { OyanaNotificationService } from './oyana-notification.service';

@Module({
  imports: [],
  controllers: [OyanaNotificationController],
  providers: [OyanaNotificationService],
})
export class OyanaNotificationModule {}

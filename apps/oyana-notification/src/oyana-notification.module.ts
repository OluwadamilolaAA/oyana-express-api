import { Module } from '@nestjs/common';
import { OyanaNotificationController } from './oyana-notification.controller';
import { notificationProviders } from './provider/notification.providers';
import { OyanaNotificationService } from './oyana-notification.service';

@Module({
  imports: [],
  controllers: [OyanaNotificationController],
  providers: [...notificationProviders, OyanaNotificationService],
})
export class OyanaNotificationModule {}

import { NestFactory } from '@nestjs/core';
import { DEFAULT_PORTS, getHttpPort } from '@package/packages';
import { OyanaNotificationModule } from './oyana-notification.module';

async function bootstrap() {
  const app = await NestFactory.create(OyanaNotificationModule);
  app.enableShutdownHooks();
  await app.listen(
    getHttpPort('NOTIFICATION_HTTP_PORT', DEFAULT_PORTS.notificationHttp),
  );
}
void bootstrap();

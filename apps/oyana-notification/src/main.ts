import { NestFactory } from '@nestjs/core';
import { OyanaNotificationModule } from './oyana-notification.module';

async function bootstrap() {
  const app = await NestFactory.create(OyanaNotificationModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();

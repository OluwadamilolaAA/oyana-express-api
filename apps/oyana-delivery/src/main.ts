import { NestFactory } from '@nestjs/core';
import { OyanaDeliveryModule } from './oyana-delivery.module';

async function bootstrap() {
  const app = await NestFactory.create(OyanaDeliveryModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();

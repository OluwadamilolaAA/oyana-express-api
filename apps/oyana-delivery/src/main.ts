import { NestFactory } from '@nestjs/core';
import { OyanaDeliveryModule } from './oyana-delivery.module';
import { DEFAULT_PORTS, getHttpPort } from '@package/packages';

async function bootstrap() {
  const app = await NestFactory.create(OyanaDeliveryModule);
  app.enableShutdownHooks();
  await app.listen(
    getHttpPort('DELIVERY_HTTP_PORT', DEFAULT_PORTS.deliveryHttp),
  );
}
void bootstrap();

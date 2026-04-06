import { NestFactory } from '@nestjs/core';
import { DEFAULT_PORTS, getHttpPort } from '@package/packages';
import { OyanaPaymentModule } from './oyana-payment.module';

async function bootstrap() {
  const app = await NestFactory.create(OyanaPaymentModule);
  app.enableShutdownHooks();
  await app.listen(getHttpPort('PAYMENT_HTTP_PORT', DEFAULT_PORTS.paymentHttp));
}
void bootstrap();

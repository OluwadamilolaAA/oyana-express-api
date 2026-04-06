import { NestFactory } from '@nestjs/core';
import { DEFAULT_PORTS, getHttpPort } from '@package/packages';
import { OyanaPricingModule } from './oyana-pricing.module';

async function bootstrap() {
  const app = await NestFactory.create(OyanaPricingModule);
  app.enableShutdownHooks();
  await app.listen(getHttpPort('PRICING_HTTP_PORT', DEFAULT_PORTS.pricingHttp));
}
void bootstrap();

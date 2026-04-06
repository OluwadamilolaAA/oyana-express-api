import { NestFactory } from '@nestjs/core';
import { OyanaFreightModule } from './oyana-freight.module';
import { DEFAULT_PORTS, getHttpPort } from '@package/packages';

async function bootstrap() {
  const app = await NestFactory.create(OyanaFreightModule);
  app.enableShutdownHooks();
  await app.listen(getHttpPort('FREIGHT_HTTP_PORT', DEFAULT_PORTS.freightHttp));
}
void bootstrap();

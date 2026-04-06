import { NestFactory } from '@nestjs/core';
import { DEFAULT_PORTS, getHttpPort } from '@package/packages';
import { OyanaLocationModule } from './oyana-location.module';

async function bootstrap() {
  const app = await NestFactory.create(OyanaLocationModule);
  app.enableShutdownHooks();
  await app.listen(
    getHttpPort('LOCATION_HTTP_PORT', DEFAULT_PORTS.locationHttp),
  );
}
void bootstrap();

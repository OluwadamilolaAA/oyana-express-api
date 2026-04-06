import { NestFactory } from '@nestjs/core';
import { OyanaRideModule } from './oyana-ride.module';
import { DEFAULT_PORTS, getHttpPort } from '@package/packages';

async function bootstrap() {
  const app = await NestFactory.create(OyanaRideModule);
  app.enableShutdownHooks();
  await app.listen(getHttpPort('RIDE_HTTP_PORT', DEFAULT_PORTS.rideHttp));
}
void bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DEFAULT_PORTS, getHttpPort } from '@package/packages';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.enableShutdownHooks();
  await app.listen(getHttpPort('GATEWAY_HTTP_PORT', DEFAULT_PORTS.gatewayHttp));
}
void bootstrap();

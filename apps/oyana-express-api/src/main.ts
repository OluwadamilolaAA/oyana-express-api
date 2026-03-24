import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DEFAULT_PORTS, getHttpPort } from '@package/packages';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  await app.listen(getHttpPort('GATEWAY_HTTP_PORT', DEFAULT_PORTS.gatewayHttp));
}
bootstrap();

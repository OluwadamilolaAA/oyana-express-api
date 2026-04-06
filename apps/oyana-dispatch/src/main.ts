import { NestFactory } from '@nestjs/core';
import { DEFAULT_PORTS, getHttpPort } from '@package/packages';
import { OyanaDispatchModule } from './oyana-dispatch.module';

async function bootstrap() {
  const app = await NestFactory.create(OyanaDispatchModule);
  app.enableShutdownHooks();
  await app.listen(
    getHttpPort('DISPATCH_HTTP_PORT', DEFAULT_PORTS.dispatchHttp),
  );
}
void bootstrap();

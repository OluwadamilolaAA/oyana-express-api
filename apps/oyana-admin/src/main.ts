import { NestFactory } from '@nestjs/core';
import { DEFAULT_PORTS, getHttpPort } from '@package/packages';
import { OyanaAdminModule } from './oyana-admin.module';

async function bootstrap() {
  const app = await NestFactory.create(OyanaAdminModule);
  app.enableShutdownHooks();
  await app.listen(getHttpPort('ADMIN_HTTP_PORT', DEFAULT_PORTS.adminHttp));
}
void bootstrap();

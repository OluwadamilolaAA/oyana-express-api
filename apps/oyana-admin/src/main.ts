import { NestFactory } from '@nestjs/core';
import { OyanaAdminModule } from './oyana-admin.module';

async function bootstrap() {
  const app = await NestFactory.create(OyanaAdminModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();

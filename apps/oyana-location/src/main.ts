import { NestFactory } from '@nestjs/core';
import { OyanaLocationModule } from './oyana-location.module';

async function bootstrap() {
  const app = await NestFactory.create(OyanaLocationModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();

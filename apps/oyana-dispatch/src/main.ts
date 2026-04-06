import { NestFactory } from '@nestjs/core';
import { OyanaDispatchModule } from './oyana-dispatch.module';

async function bootstrap() {
  const app = await NestFactory.create(OyanaDispatchModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();

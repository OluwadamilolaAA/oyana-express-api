import { NestFactory } from '@nestjs/core';
import { OyanaUserModule } from './oyana-user.module';

async function bootstrap() {
  const app = await NestFactory.create(OyanaUserModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();

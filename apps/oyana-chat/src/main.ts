import { NestFactory } from '@nestjs/core';
import { OyanaChatModule } from './oyana-chat.module';

async function bootstrap() {
  const app = await NestFactory.create(OyanaChatModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();

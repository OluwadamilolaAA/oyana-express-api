import { NestFactory } from '@nestjs/core';
import { DEFAULT_PORTS, getHttpPort } from '@package/packages';
import { OyanaChatModule } from './oyana-chat.module';

async function bootstrap() {
  const app = await NestFactory.create(OyanaChatModule);
  app.enableShutdownHooks();
  await app.listen(getHttpPort('CHAT_HTTP_PORT', DEFAULT_PORTS.chatHttp));
}
void bootstrap();

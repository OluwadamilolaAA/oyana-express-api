import { NestFactory } from '@nestjs/core';
import { OyanaFreightModule } from './oyana-freight.module';

async function bootstrap() {
  const app = await NestFactory.create(OyanaFreightModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();

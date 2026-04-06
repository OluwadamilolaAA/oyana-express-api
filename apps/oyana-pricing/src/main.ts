import { NestFactory } from '@nestjs/core';
import { OyanaPricingModule } from './oyana-pricing.module';

async function bootstrap() {
  const app = await NestFactory.create(OyanaPricingModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();

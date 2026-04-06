import { NestFactory } from '@nestjs/core';
import { OyanaPaymentModule } from './oyana-payment.module';

async function bootstrap() {
  const app = await NestFactory.create(OyanaPaymentModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { OyanaRideModule } from './oyana-ride.module';

async function bootstrap() {
  const app = await NestFactory.create(OyanaRideModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();

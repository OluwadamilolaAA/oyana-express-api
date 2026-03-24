import { NestFactory } from '@nestjs/core';
import { OyanaAuthModule } from './oyana-auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(OyanaAuthModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: join(process.cwd(), '/libs/packages/src/proto/auth.proto'),
      url: '0.0.0.0:50051',
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();

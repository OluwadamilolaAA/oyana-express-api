import { NestFactory } from '@nestjs/core';
import { OyanaUserModule } from './oyana-user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(OyanaUserModule);
  app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: {
        package: 'user',
        protoPath: join(process.cwd(), '/libs/packages/src/proto/user.proto'),
        url: '0.0.0.0:50051',
      },
    });
  
    await app.startAllMicroservices();
    await app.listen(3100);
}
bootstrap();

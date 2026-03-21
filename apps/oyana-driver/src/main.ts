import { NestFactory } from '@nestjs/core';
import { OyanaDriverModule } from './oyana-driver.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(OyanaDriverModule);
 app.connectMicroservice<MicroserviceOptions>({
     transport: Transport.GRPC,
     options: {
       package: 'driver',
       protoPath: join(process.cwd(), '/libs/packages/proto/driver.proto'),
       url: '0.0.0.0:50051',
     },
   });
 
   await app.startAllMicroservices();
   await app.listen(3000);
 
}
bootstrap();

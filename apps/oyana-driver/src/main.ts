import { NestFactory } from '@nestjs/core';
import { OyanaDriverModule } from './oyana-driver.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  DEFAULT_PORTS,
  getGrpcServerUrl,
  getHttpPort,
  getProtoPath,
} from '@package/packages';

async function bootstrap() {
  const app = await NestFactory.create(OyanaDriverModule);
  app.enableShutdownHooks();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'driver',
      protoPath: getProtoPath('driver.proto'),
      url: getGrpcServerUrl('DRIVER_GRPC_BIND_URL', DEFAULT_PORTS.driverGrpc),
    },
  });

  await app.startAllMicroservices();
  await app.listen(getHttpPort('DRIVER_HTTP_PORT', DEFAULT_PORTS.driverHttp));
}
bootstrap();

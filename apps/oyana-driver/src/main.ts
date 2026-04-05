import { NestFactory } from '@nestjs/core';
import { OyanaDriverModule } from './oyana-driver.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  getCloudRunGrpcServerUrl,
  DEFAULT_PORTS,
  getGrpcServerUrl,
  getHttpPort,
  isCloudRunEnvironment,
  getProtoPath,
} from '@package/packages';

async function bootstrap() {
  if (isCloudRunEnvironment()) {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      OyanaDriverModule,
      {
        transport: Transport.GRPC,
        options: {
          package: 'driver',
          protoPath: getProtoPath('driver.proto'),
          url: getCloudRunGrpcServerUrl(DEFAULT_PORTS.driverGrpc),
        },
      },
    );
    app.enableShutdownHooks();
    await app.listen();
    return;
  }

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
void bootstrap();

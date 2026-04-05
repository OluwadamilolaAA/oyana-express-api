import { NestFactory } from '@nestjs/core';
import { OyanaUserModule } from './oyana-user.module';
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
      OyanaUserModule,
      {
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: getProtoPath('user.proto'),
          url: getCloudRunGrpcServerUrl(DEFAULT_PORTS.userGrpc),
        },
      },
    );
    app.enableShutdownHooks();
    await app.listen();
    return;
  }

  const app = await NestFactory.create(OyanaUserModule);
  app.enableShutdownHooks();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: getProtoPath('user.proto'),
      url: getGrpcServerUrl('USER_GRPC_BIND_URL', DEFAULT_PORTS.userGrpc),
    },
  });

  await app.startAllMicroservices();
  await app.listen(getHttpPort('USER_HTTP_PORT', DEFAULT_PORTS.userHttp));
}
void bootstrap();

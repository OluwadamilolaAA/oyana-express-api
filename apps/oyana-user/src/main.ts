import { NestFactory } from '@nestjs/core';
import { OyanaUserModule } from './oyana-user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  DEFAULT_PORTS,
  getGrpcServerUrl,
  getHttpPort,
  getProtoPath,
} from '@package/packages';

async function bootstrap() {
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
bootstrap();

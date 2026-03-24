import { NestFactory } from '@nestjs/core';
import { OyanaAuthModule } from './oyana-auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import {
  DEFAULT_PORTS,
  getGrpcServerUrl,
  getHttpPort,
  getProtoPath,
} from '@package/packages';

async function bootstrap() {
  const app = await NestFactory.create(OyanaAuthModule);
  app.enableShutdownHooks();

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: getProtoPath('auth.proto'),
      url: getGrpcServerUrl('AUTH_GRPC_BIND_URL', DEFAULT_PORTS.authGrpc),
    },
  });

  await app.startAllMicroservices();
  await app.listen(getHttpPort('AUTH_HTTP_PORT', DEFAULT_PORTS.authHttp));
}
bootstrap();

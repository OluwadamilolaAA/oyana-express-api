import { NestFactory } from '@nestjs/core';
import { OyanaAuthModule } from './oyana-auth.module';
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
      OyanaAuthModule,
      {
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: getProtoPath('auth.proto'),
          url: getCloudRunGrpcServerUrl(DEFAULT_PORTS.authGrpc),
        },
      },
    );
    app.enableShutdownHooks();
    await app.listen();
    return;
  }

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
void bootstrap();

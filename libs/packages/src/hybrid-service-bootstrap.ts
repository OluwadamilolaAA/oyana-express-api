import type { Type } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  KafkaOptions,
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import {
  getCloudRunGrpcServerUrl,
  getGrpcServerUrl,
  getHttpPort,
  getKafkaTransportOptions,
  getProtoPath,
  hasKafkaTransport,
  isCloudRunEnvironment,
} from './runtime-config';

export interface HybridServiceBootstrapOptions {
  module: Type<unknown>;
  servicePrefix: string;
  serviceName: string;
  grpcPackage: string;
  protoFileName: string;
  grpcBindEnvName: string;
  grpcDefaultPort: number;
  httpEnvName: string;
  httpDefaultPort: number;
}

function createGrpcOptions(
  grpcPackage: string,
  protoFileName: string,
  url: string,
): MicroserviceOptions {
  return {
    transport: Transport.GRPC,
    options: {
      package: grpcPackage,
      protoPath: getProtoPath(protoFileName),
      url,
    },
  };
}

function createKafkaOptions(
  servicePrefix: string,
  serviceName: string,
): KafkaOptions {
  return {
    transport: Transport.KAFKA,
    options: getKafkaTransportOptions(servicePrefix, serviceName),
  };
}

export async function bootstrapHybridService(
  options: HybridServiceBootstrapOptions,
): Promise<void> {
  const kafkaEnabled = hasKafkaTransport(options.servicePrefix);
  const kafkaTransportOptions = kafkaEnabled
    ? createKafkaOptions(options.servicePrefix, options.serviceName)
    : undefined;

  if (isCloudRunEnvironment()) {
    const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
      options.module,
      createGrpcOptions(
        options.grpcPackage,
        options.protoFileName,
        getCloudRunGrpcServerUrl(options.grpcDefaultPort),
      ),
    );
    grpcApp.enableShutdownHooks();

    const startupTasks: Promise<void>[] = [grpcApp.listen()];

    // Cloud Run exposes a single inbound port, so Kafka runs in a second Nest context.
    if (kafkaTransportOptions) {
      const kafkaApp =
        await NestFactory.createMicroservice<MicroserviceOptions>(
          options.module,
          kafkaTransportOptions,
        );
      kafkaApp.enableShutdownHooks();
      startupTasks.push(kafkaApp.listen());
    }

    await Promise.all(startupTasks);
    return;
  }

  const app = await NestFactory.create(options.module);
  app.enableShutdownHooks();

  app.connectMicroservice<MicroserviceOptions>(
    createGrpcOptions(
      options.grpcPackage,
      options.protoFileName,
      getGrpcServerUrl(options.grpcBindEnvName, options.grpcDefaultPort),
    ),
  );

  if (kafkaTransportOptions) {
    app.connectMicroservice<MicroserviceOptions>(kafkaTransportOptions);
  }

  await app.startAllMicroservices();
  await app.listen(getHttpPort(options.httpEnvName, options.httpDefaultPort));
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  DEFAULT_PORTS,
  getGrpcClientUrl,
  getProtoPath,
} from '@package/packages';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: getProtoPath('auth.proto'),
          url: getGrpcClientUrl('AUTH_GRPC_URL', DEFAULT_PORTS.authGrpc),
        },
      },
      {
        name: 'USER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: getProtoPath('user.proto'),
          url: getGrpcClientUrl('USER_GRPC_URL', DEFAULT_PORTS.userGrpc),
        },
      },
      {
        name: 'DRIVER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'driver',
          protoPath: getProtoPath('driver.proto'),
          url: getGrpcClientUrl('DRIVER_GRPC_URL', DEFAULT_PORTS.driverGrpc),
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { ClientsModule } from '@nestjs/microservices/module/clients.module';
import { Transport } from '@nestjs/microservices';
import {
  DEFAULT_PORTS,
  getGrpcClientTransportOptions,
  getProtoPath,
} from '@package/packages';

const driverServiceTransportOptions = getGrpcClientTransportOptions(
  'DRIVER_GRPC_URL',
  DEFAULT_PORTS.driverGrpc,
);

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DRIVER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'driver',
          protoPath: getProtoPath('driver.proto'),
          ...driverServiceTransportOptions,
        },
      },
    ]),
  ],
  controllers: [DriverController],
  providers: [DriverService],
  exports: [DriverService],
})
export class DriverModule {}

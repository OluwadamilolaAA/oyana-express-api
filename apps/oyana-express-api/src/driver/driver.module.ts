import { Module } from '@nestjs/common';
import { DriverController } from './driver.controller';
import { DriverService } from './driver.service';
import { ClientsModule } from '@nestjs/microservices/module/clients.module';
import { Transport } from '@nestjs/microservices';
import { DEFAULT_PORTS, getGrpcClientUrl, getProtoPath } from '@package/packages';

@Module({
  imports: [
      ClientsModule.register([
        {
          name: 'USER_SERVICE',
          transport: Transport.GRPC,
          options: {
            package: 'user',
            protoPath: getProtoPath('user.proto'),
            url: getGrpcClientUrl('USER_GRPC_URL', DEFAULT_PORTS.userGrpc),
          },
        },
      ]),
     ],
  controllers: [DriverController],
  providers: [DriverService],
  exports: [DriverService],
})
export class DriverModule {}

import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  DEFAULT_PORTS,
  getGrpcClientTransportOptions,
  getProtoPath,
} from '@package/packages';
import { AuthModule } from '../auth/auth.module';

const userServiceTransportOptions = getGrpcClientTransportOptions(
  'USER_GRPC_URL',
  DEFAULT_PORTS.userGrpc,
);

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: getProtoPath('user.proto'),
          ...userServiceTransportOptions,
        },
      },
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

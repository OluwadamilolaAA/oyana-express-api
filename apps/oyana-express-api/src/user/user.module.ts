import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  DEFAULT_PORTS,
  getGrpcClientUrl,
  getProtoPath,
} from '@package/packages';
import { AuthModule } from '../auth/auth.module';

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
    AuthModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

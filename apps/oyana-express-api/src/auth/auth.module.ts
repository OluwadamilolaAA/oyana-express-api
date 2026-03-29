import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  DEFAULT_PORTS,
  getGrpcClientUrl,
  getProtoPath,
} from '@package/packages';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './guards/auth.guard';

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
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      //  AUTH SERVICE
      {
        name: 'AUTH_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: join(process.cwd(), '/libs/packages/proto/auth.proto'),
          url: process.env.AUTH_GRPC_URL || 'localhost:3000',
        },
      },

      //  USER SERVICE
      {
        name: 'USER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(process.cwd(), '/libs/packages/proto/user.proto'),
          url: process.env.USER_GRPC_URL || 'localhost:3100',
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

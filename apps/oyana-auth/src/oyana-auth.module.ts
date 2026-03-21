import { Module } from '@nestjs/common';
import { OyanaAuthController } from './oyana-auth.controller';
import { OyanaAuthService } from './oyana-auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: join(process.cwd(), '/libs/packages/proto/user.proto'),
          url: process.env.USER_GRPC_URL || 'user:3000',
        },
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'supersecret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [OyanaAuthController],
  providers: [OyanaAuthService],
})
export class OyanaAuthModule {}

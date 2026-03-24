import { Module } from '@nestjs/common';
import { OyanaAuthController } from './oyana-auth.controller';
import { OyanaAuthService } from './Services/oyana-auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { AuditLogService } from './Services/audit-log.service';
import { SessionService } from './Services/oyana-session.service';
import { OTPService } from './Services/generate-otp.service';
import { CredentialService } from './Services/credential.service';
import { DatabaseModule } from './database.module';
import { authProviders } from './auth.providers';
import {
  DEFAULT_PORTS,
  getGrpcClientUrl,
  getProtoPath,
  requireEnv,
} from '@package/packages';

@Module({
  imports: [
    DatabaseModule,
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
    JwtModule.register({
      secret: requireEnv('JWT_SECRET'),
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [OyanaAuthController],
  providers: [
    ...authProviders,
    AuditLogService,
    SessionService,
    OTPService,
    CredentialService,
    OyanaAuthService,
  ],
})
export class OyanaAuthModule {}

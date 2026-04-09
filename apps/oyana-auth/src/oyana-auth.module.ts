import { Module } from '@nestjs/common';
import { OyanaAuthController } from './oyana-auth.controller';
import { OyanaAuthService } from './Services/oyana-auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { AuditLogService } from './Services/audit-log.service';
import { SessionService } from './Services/oyana-session.service';
import { CredentialService } from './Services/credential.service';
import { DatabaseModule } from './database.module';
import { authProviders } from './provider/auth.providers';
import { HealthController } from './health.controller';
import {
  DEFAULT_PORTS,
  getGrpcClientTransportOptions,
  getProtoPath,
  requireEnv,
} from '@package/packages';
import { OTPService } from './Services/generate-otp.service';

const userServiceTransportOptions = getGrpcClientTransportOptions(
  'USER_GRPC_URL',
  DEFAULT_PORTS.userGrpc,
);

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
          ...userServiceTransportOptions,
        },
      },
    ]),
    JwtModule.register({
      secret: requireEnv('JWT_SECRET'),
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [OyanaAuthController, HealthController],
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

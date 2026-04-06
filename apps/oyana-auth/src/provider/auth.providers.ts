import { DataSource } from 'typeorm';
import { OtpVerification } from '../Entities/verification-otp.entity';
import { Session } from '../Entities/session.entity';
import { AuthIdentity } from '../Entities/auth.entity';
import { AuthAuditLog } from '../Entities/audit-log.entity';
import { Credential } from '../Entities/credentials.entity';

export const AUTH_AUDIT_LOG_REPOSITORY = 'AUTH_AUDIT_LOG_REPOSITORY';
export const AUTH_CREDENTIAL_REPOSITORY = 'AUTH_CREDENTIAL_REPOSITORY';
export const AUTH_OTP_REPOSITORY = 'AUTH_OTP_REPOSITORY';
export const AUTH_SESSION_REPOSITORY = 'AUTH_SESSION_REPOSITORY';
export const AUTH_IDENTITY_REPOSITORY = 'AUTH_IDENTITY_REPOSITORY';

export const authProviders = [
  {
    provide: AUTH_AUDIT_LOG_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(AuthAuditLog),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: AUTH_CREDENTIAL_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(Credential),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: AUTH_OTP_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(OtpVerification),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: AUTH_SESSION_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(Session),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: AUTH_IDENTITY_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(AuthIdentity),
    inject: ['DATA_SOURCE'],
  },
];

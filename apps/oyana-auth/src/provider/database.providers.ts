import { DataSource } from 'typeorm';
import { getMongoConnectionSettings } from '@package/packages';
import { AuthAuditLog } from '../Entities/audit-log.entity';
import { AuthIdentity } from '../Entities/auth.entity';
import { Credential } from '../Entities/credentials.entity';
import { Session } from '../Entities/session.entity';
import { OtpVerification } from '../Entities/verification-otp.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const mongoSettings = getMongoConnectionSettings('AUTH', 'oyana_auth');

      const dataSource = new DataSource({
        type: 'mongodb',
        ...(mongoSettings.uri
          ? { url: mongoSettings.uri }
          : {
              host: mongoSettings.host!,
              port: mongoSettings.port!,
            }),
        database: mongoSettings.database,
        entities: [
          AuthAuditLog,
          AuthIdentity,
          Credential,
          Session,
          OtpVerification,
        ],
        synchronize: mongoSettings.synchronize,
      });

      return dataSource.initialize();
    },
  },
];

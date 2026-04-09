import { DataSource } from 'typeorm';
import { getMongoConnectionSettings } from '@package/packages';
import {
  EmergencyContactEntity,
  KycProfileEntity,
  UserAddressEntity,
  UserEntity,
  UserPreferenceEntity,
} from '../entity/user.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const mongoSettings = getMongoConnectionSettings('USER', 'oyana_user');

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
          UserEntity,
          UserAddressEntity,
          UserPreferenceEntity,
          EmergencyContactEntity,
          KycProfileEntity,
        ],
        synchronize: mongoSettings.synchronize,
      });

      return dataSource.initialize();
    },
  },
];

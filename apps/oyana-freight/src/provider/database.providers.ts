import { DataSource } from 'typeorm';
import { getMongoConnectionSettings } from '@package/packages';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const mongoSettings = getMongoConnectionSettings(
        'FREIGHT',
        'oyana_freight',
      );

      const dataSource = new DataSource({
        type: 'mongodb',
        ...(mongoSettings.uri
          ? { url: mongoSettings.uri }
          : {
              host: mongoSettings.host!,
              port: mongoSettings.port!,
            }),
        database: mongoSettings.database,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: mongoSettings.synchronize,
      });

      return dataSource.initialize();
    },
  },
];

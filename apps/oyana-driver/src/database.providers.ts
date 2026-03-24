import { DataSource } from 'typeorm';
import { getMongoConnectionSettings } from '@package/packages';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const mongoSettings = getMongoConnectionSettings(
        'DRIVER',
        'oyana_driver',
      );

      const dataSource = new DataSource({
        type: 'mongodb',
        host: mongoSettings.host,
        port: mongoSettings.port,
        database: mongoSettings.database,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: mongoSettings.synchronize,
      });

      return dataSource.initialize();
    },
  },
];

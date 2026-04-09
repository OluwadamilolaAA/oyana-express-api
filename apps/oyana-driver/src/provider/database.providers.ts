import { DataSource } from 'typeorm';
import { getMongoConnectionSettings } from '@package/packages';
import {
  DriverDocumentEntity,
  DriverProfileEntity,
  DriverStatusEntity,
  DriverVehicleAssignmentEntity,
  VehicleEntity,
  VehicleTypeEntity,
} from '../entity/driver.entity';

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
        ...(mongoSettings.uri
          ? { url: mongoSettings.uri }
          : {
              host: mongoSettings.host!,
              port: mongoSettings.port!,
            }),
        database: mongoSettings.database,
        entities: [
          DriverProfileEntity,
          DriverDocumentEntity,
          DriverStatusEntity,
          VehicleTypeEntity,
          VehicleEntity,
          DriverVehicleAssignmentEntity,
        ],
        synchronize: mongoSettings.synchronize,
      });

      return dataSource.initialize();
    },
  },
];

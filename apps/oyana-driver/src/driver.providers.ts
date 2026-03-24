import { DataSource } from 'typeorm';
import { DriverProfile } from './driver.entity';

export const DRIVER_REPOSITORY = 'DRIVER_REPOSITORY';

export const driverProviders = [
  {
    provide: DRIVER_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(DriverProfile),
    inject: ['DATA_SOURCE'],
  },
];

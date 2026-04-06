import { DataSource } from 'typeorm';
import { DriverProfileEntity } from './entity/driver.entity';

export const DRIVER_REPOSITORY = 'DRIVER_REPOSITORY';

export const driverProviders = [
  {
    provide: DRIVER_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(DriverProfileEntity),
    inject: ['DATA_SOURCE'],
  },
];

import { DataSource } from 'typeorm';
import {
  DriverDocumentEntity,
  DriverProfileEntity,
  DriverStatusEntity,
  DriverVehicleAssignmentEntity,
  VehicleEntity,
  VehicleTypeEntity,
} from '../entity/driver.entity';

export const DRIVER_REPOSITORY = 'DRIVER_REPOSITORY';
export const DRIVER_DOCUMENT_REPOSITORY = 'DRIVER_DOCUMENT_REPOSITORY';
export const DRIVER_STATUS_REPOSITORY = 'DRIVER_STATUS_REPOSITORY';
export const VEHICLE_TYPE_REPOSITORY = 'VEHICLE_TYPE_REPOSITORY';
export const VEHICLE_REPOSITORY = 'VEHICLE_REPOSITORY';
export const DRIVER_VEHICLE_ASSIGNMENT_REPOSITORY =
  'DRIVER_VEHICLE_ASSIGNMENT_REPOSITORY';

export const driverProviders = [
  {
    provide: DRIVER_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(DriverProfileEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: DRIVER_DOCUMENT_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(DriverDocumentEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: DRIVER_STATUS_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(DriverStatusEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: VEHICLE_TYPE_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(VehicleTypeEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: VEHICLE_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(VehicleEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: DRIVER_VEHICLE_ASSIGNMENT_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(DriverVehicleAssignmentEntity),
    inject: ['DATA_SOURCE'],
  },
];

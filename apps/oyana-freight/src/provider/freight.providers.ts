import { DataSource } from 'typeorm';
import {
  FreightAssignmentEntity,
  FreightBookingEntity,
  FreightItemEntity,
  FreightQuoteEntity,
  FreightRequestEntity,
  FreightStatusHistoryEntity,
} from '../entity/freight.entity';

export const FREIGHT_REQUEST_REPOSITORY = 'FREIGHT_REQUEST_REPOSITORY';
export const FREIGHT_ITEM_REPOSITORY = 'FREIGHT_ITEM_REPOSITORY';
export const FREIGHT_QUOTE_REPOSITORY = 'FREIGHT_QUOTE_REPOSITORY';
export const FREIGHT_BOOKING_REPOSITORY = 'FREIGHT_BOOKING_REPOSITORY';
export const FREIGHT_ASSIGNMENT_REPOSITORY = 'FREIGHT_ASSIGNMENT_REPOSITORY';
export const FREIGHT_STATUS_HISTORY_REPOSITORY =
  'FREIGHT_STATUS_HISTORY_REPOSITORY';

export const freightProviders = [
  {
    provide: FREIGHT_REQUEST_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(FreightRequestEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: FREIGHT_ITEM_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(FreightItemEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: FREIGHT_QUOTE_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(FreightQuoteEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: FREIGHT_BOOKING_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(FreightBookingEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: FREIGHT_ASSIGNMENT_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(FreightAssignmentEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: FREIGHT_STATUS_HISTORY_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(FreightStatusHistoryEntity),
    inject: ['DATA_SOURCE'],
  },
];

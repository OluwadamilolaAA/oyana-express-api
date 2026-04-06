import { DataSource } from 'typeorm';
import {
  DeliveryAssignmentEntity,
  DeliveryEntity,
  DeliveryItemEntity,
  DeliveryStatusHistoryEntity,
  ProofOfDeliveryEntity,
  ReceiverEntity,
} from '../entity/delivery.entity';

export const DELIVERY_REPOSITORY = 'DELIVERY_REPOSITORY';
export const DELIVERY_ITEM_REPOSITORY = 'DELIVERY_ITEM_REPOSITORY';
export const DELIVERY_RECEIVER_REPOSITORY = 'DELIVERY_RECEIVER_REPOSITORY';
export const DELIVERY_STATUS_HISTORY_REPOSITORY =
  'DELIVERY_STATUS_HISTORY_REPOSITORY';
export const DELIVERY_ASSIGNMENT_REPOSITORY = 'DELIVERY_ASSIGNMENT_REPOSITORY';
export const DELIVERY_PROOF_OF_DELIVERY_REPOSITORY =
  'DELIVERY_PROOF_OF_DELIVERY_REPOSITORY';

export const deliveryProviders = [
  {
    provide: DELIVERY_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(DeliveryEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: DELIVERY_ITEM_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(DeliveryItemEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: DELIVERY_RECEIVER_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(ReceiverEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: DELIVERY_STATUS_HISTORY_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(DeliveryStatusHistoryEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: DELIVERY_ASSIGNMENT_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(DeliveryAssignmentEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: DELIVERY_PROOF_OF_DELIVERY_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(ProofOfDeliveryEntity),
    inject: ['DATA_SOURCE'],
  },
];

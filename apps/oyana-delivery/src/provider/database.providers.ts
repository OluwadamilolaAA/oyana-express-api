import { DataSource } from 'typeorm';
import { getMongoConnectionSettings } from '@package/packages';
import {
  DeliveryAssignmentEntity,
  DeliveryEntity,
  DeliveryItemEntity,
  DeliveryStatusHistoryEntity,
  ProofOfDeliveryEntity,
  ReceiverEntity,
} from '../entity/delivery.entity';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const mongoSettings = getMongoConnectionSettings(
        'DELIVERY',
        'oyana_delivery',
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
          DeliveryEntity,
          DeliveryItemEntity,
          ReceiverEntity,
          DeliveryStatusHistoryEntity,
          DeliveryAssignmentEntity,
          ProofOfDeliveryEntity,
        ],
        synchronize: mongoSettings.synchronize,
      });

      return dataSource.initialize();
    },
  },
];

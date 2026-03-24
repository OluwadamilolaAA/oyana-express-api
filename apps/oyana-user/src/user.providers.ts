import { DataSource } from 'typeorm';
import { User } from './user.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export const userProviders = [
  {
    provide: USER_REPOSITORY,
    useFactory: (dataSource: DataSource) => dataSource.getMongoRepository(User),
    inject: ['DATA_SOURCE'],
  },
];

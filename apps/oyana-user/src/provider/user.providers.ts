import { DataSource } from 'typeorm';
import { UserEntity } from '../entity/user.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export const userProviders = [
  {
    provide: USER_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(UserEntity),
    inject: ['DATA_SOURCE'],
  },
];

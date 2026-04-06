import { DataSource } from 'typeorm';
import {
  EmergencyContactEntity,
  KycProfileEntity,
  UserAddressEntity,
  UserEntity,
  UserPreferenceEntity,
} from '../entity/user.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY';
export const USER_ADDRESS_REPOSITORY = 'USER_ADDRESS_REPOSITORY';
export const USER_PREFERENCE_REPOSITORY = 'USER_PREFERENCE_REPOSITORY';
export const USER_EMERGENCY_CONTACT_REPOSITORY =
  'USER_EMERGENCY_CONTACT_REPOSITORY';
export const USER_KYC_PROFILE_REPOSITORY = 'USER_KYC_PROFILE_REPOSITORY';

export const userProviders = [
  {
    provide: USER_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(UserEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: USER_ADDRESS_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(UserAddressEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: USER_PREFERENCE_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(UserPreferenceEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: USER_EMERGENCY_CONTACT_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(EmergencyContactEntity),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: USER_KYC_PROFILE_REPOSITORY,
    useFactory: (dataSource: DataSource) =>
      dataSource.getMongoRepository(KycProfileEntity),
    inject: ['DATA_SOURCE'],
  },
];

import { ObjectId } from 'mongodb';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';
import type {
  EmergencyContact as EmergencyContactProto,
  KycProfile as KycProfileProto,
  User as UserProto,
  UserAddress as UserAddressProto,
  UserPreference as UserPreferenceProto,
} from '@package/packages/generated/user';
import type { Timestamp } from '@package/packages/generated/google/protobuf/timestamp';

@Entity('users')
export class UserEntity implements UserProto {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Column({ length: 120 })
  name!: string;

  @Index({ unique: true })
  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ default: '' })
  phone!: string;

  @Column({ default: 'customer' })
  role!: string;
}

@Entity('user_addresses')
export class UserAddressEntity implements UserAddressProto {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Index()
  @Column()
  userId!: string;

  @Column()
  label!: string;

  @Column()
  line1!: string;

  @Column({ nullable: true })
  line2?: string;

  @Column()
  city!: string;

  @Column({ nullable: true })
  state?: string;

  @Column()
  country!: string;

  @Column({ nullable: true })
  postalCode?: string;

  @Column({ nullable: true })
  latitude?: number;

  @Column({ nullable: true })
  longitude?: number;

  @Column({ default: false })
  isDefault!: boolean;

  @Column({ nullable: true })
  createdAt?: Timestamp;

  @Column({ nullable: true })
  updatedAt?: Timestamp;
}

@Entity('user_preferences')
export class UserPreferenceEntity implements UserPreferenceProto {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Index({ unique: true })
  @Column()
  userId!: string;

  @Column({ default: 'en' })
  language!: string;

  @Column({ default: 'NGN' })
  currency!: string;

  @Column({ default: [] })
  notificationChannels: string[] = [];

  @Column({ default: [] })
  preferredVehicleTypes: string[] = [];

  @Column({ default: false })
  marketingOptIn!: boolean;

  @Column({ default: false })
  darkMode!: boolean;

  @Column({ nullable: true })
  createdAt?: Timestamp;

  @Column({ nullable: true })
  updatedAt?: Timestamp;
}

@Entity('emergency_contacts')
export class EmergencyContactEntity implements EmergencyContactProto {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Index()
  @Column()
  userId!: string;

  @Column()
  name!: string;

  @Column()
  phone!: string;

  @Column()
  relationship!: string;

  @Column({ default: false })
  isPrimary!: boolean;

  @Column({ nullable: true })
  createdAt?: Timestamp;
}

@Entity('kyc_profiles')
export class KycProfileEntity implements KycProfileProto {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Index({ unique: true })
  @Column()
  userId!: string;

  @Column()
  fullName!: string;

  @Column({ nullable: true })
  dateOfBirth?: string;

  @Column()
  idType!: string;

  @Column()
  idNumber!: string;

  @Column({ default: 'PENDING' })
  verificationStatus!: string;

  @Column({ nullable: true })
  selfieUrl?: string;

  @Column({ nullable: true })
  documentFrontUrl?: string;

  @Column({ nullable: true })
  documentBackUrl?: string;

  @Column({ nullable: true })
  verifiedAt?: Timestamp;

  @Column({ nullable: true })
  createdAt?: Timestamp;

  @Column({ nullable: true })
  updatedAt?: Timestamp;
}

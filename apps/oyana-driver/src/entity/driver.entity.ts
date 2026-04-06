import { ObjectId } from 'mongodb';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';
import type {
  DriverDocument as DriverDocumentProto,
  DriverProfile as DriverProfileProto,
  DriverStatus as DriverStatusProto,
  DriverVehicleAssignment as DriverVehicleAssignmentProto,
  Vehicle as VehicleProto,
  VehicleType as VehicleTypeProto,
} from '@package/packages/generated/driver';
import type { Timestamp } from '@package/packages/generated/google/protobuf/timestamp';

@Entity('drivers')
export class DriverProfileEntity implements DriverProfileProto {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Index({ unique: true })
  @Column()
  userId!: string;

  @Column()
  vehicleType!: string;

  @Index({ unique: true })
  @Column()
  licenseNumber!: string;

  @Column({ default: 'PENDING' })
  onboardingStatus!: string;

  @Column({ default: 'PENDING' })
  approvalStatus!: string;

  @Column({ default: 'OFFLINE' })
  currentStatus!: string;

  @Column({ nullable: true })
  activeVehicleAssignmentId?: string;

  @Column({ default: true })
  isAvailable!: boolean;
}

@Entity('driver_documents')
export class DriverDocumentEntity implements DriverDocumentProto {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Index()
  @Column()
  driverId!: string;

  @Column()
  documentType!: string;

  @Column({ nullable: true })
  documentNumber?: string;

  @Column()
  fileUrl!: string;

  @Column({ default: 'PENDING' })
  verificationStatus!: string;

  @Column({ nullable: true })
  expiresAt?: Timestamp;

  @Column({ nullable: true })
  uploadedAt?: Timestamp;

  @Column({ nullable: true })
  updatedAt?: Timestamp;
}

@Entity('driver_status')
export class DriverStatusEntity implements DriverStatusProto {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Index()
  @Column()
  driverId!: string;

  @Column()
  status!: string;

  @Column({ default: false })
  isAvailable!: boolean;

  @Column({ nullable: true })
  reason?: string;

  @Column({ nullable: true })
  changedAt?: Timestamp;
}

@Entity('vehicle_types')
export class VehicleTypeEntity implements VehicleTypeProto {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Index({ unique: true })
  @Column()
  code!: string;

  @Column()
  name!: string;

  @Column()
  category!: string;

  @Column({ default: 4 })
  maxPassengers!: number;

  @Column({ nullable: true })
  maxLoadKg?: number;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  createdAt?: Timestamp;

  @Column({ nullable: true })
  updatedAt?: Timestamp;
}

@Entity('vehicles')
export class VehicleEntity implements VehicleProto {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Index({ unique: true })
  @Column()
  plateNumber!: string;

  @Column({ nullable: true })
  vin?: string;

  @Column()
  make!: string;

  @Column()
  model!: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  year?: number;

  @Column()
  vehicleTypeId!: string;

  @Column({ nullable: true })
  ownerDriverId?: string;

  @Column({ default: 'ACTIVE' })
  status!: string;

  @Column({ nullable: true })
  createdAt?: Timestamp;

  @Column({ nullable: true })
  updatedAt?: Timestamp;
}

@Entity('driver_vehicle_assignments')
export class DriverVehicleAssignmentEntity implements DriverVehicleAssignmentProto {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Index()
  @Column()
  driverId!: string;

  @Index()
  @Column()
  vehicleId!: string;

  @Column({ nullable: true })
  assignedAt?: Timestamp;

  @Column({ nullable: true })
  unassignedAt?: Timestamp;

  @Column({ default: true })
  isActive!: boolean;
}

import { ObjectId } from 'mongodb';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';
import type {
  FreightAssignment as FreightAssignmentProto,
  FreightBooking as FreightBookingProto,
  FreightItem as FreightItemProto,
  FreightQuote as FreightQuoteProto,
  FreightRequest as FreightRequestProto,
  FreightStatusHistory as FreightStatusHistoryProto,
} from '@package/packages/generated/freight';
import type { Timestamp } from '@package/packages/generated/google/protobuf/timestamp';

@Entity('freight_requests')
export class FreightRequestEntity implements FreightRequestProto {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Index()
  @Column()
  requesterId!: string;

  @Column()
  originAddress!: string;

  @Column()
  destinationAddress!: string;

  @Column()
  cargoType!: string;

  @Column()
  totalWeightKg!: number;

  @Column({ nullable: true })
  totalVolumeM3?: number;

  @Column({ nullable: true })
  scheduledPickupAt?: Timestamp;

  @Column({ default: 'REQUESTED' })
  status!: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  createdAt?: Timestamp;

  @Column({ nullable: true })
  updatedAt?: Timestamp;
}

@Entity('freight_items')
export class FreightItemEntity implements FreightItemProto {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Index()
  @Column()
  freightRequestId!: string;

  @Column()
  description!: string;

  @Column({ default: 1 })
  quantity!: number;

  @Column()
  weightKg!: number;

  @Column({ nullable: true })
  lengthCm?: number;

  @Column({ nullable: true })
  widthCm?: number;

  @Column({ nullable: true })
  heightCm?: number;

  @Column({ default: false })
  isFragile!: boolean;
}

@Entity('freight_quotes')
export class FreightQuoteEntity implements FreightQuoteProto {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Index()
  @Column()
  freightRequestId!: string;

  @Column({ nullable: true })
  providerId?: string;

  @Column()
  quotedAmount!: number;

  @Column({ default: 'NGN' })
  currency!: string;

  @Column({ nullable: true })
  validUntil?: Timestamp;

  @Column({ default: 'PENDING' })
  status!: string;

  @Column({ nullable: true })
  createdAt?: Timestamp;

  @Column({ nullable: true })
  updatedAt?: Timestamp;
}

@Entity('freight_bookings')
export class FreightBookingEntity implements FreightBookingProto {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Index({ unique: true })
  @Column()
  freightRequestId!: string;

  @Column()
  quoteId!: string;

  @Column()
  bookingReference!: string;

  @Column()
  assignedVehicleType!: string;

  @Column({ nullable: true })
  driverId?: string;

  @Column({ default: 'BOOKED' })
  status!: string;

  @Column({ nullable: true })
  bookedAt?: Timestamp;

  @Column({ nullable: true })
  updatedAt?: Timestamp;
}

@Entity('freight_assignments')
export class FreightAssignmentEntity implements FreightAssignmentProto {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Index({ unique: true })
  @Column()
  freightBookingId!: string;

  @Column()
  driverId!: string;

  @Column()
  vehicleId!: string;

  @Column({ default: 'ASSIGNED' })
  status!: string;

  @Column({ nullable: true })
  assignedAt?: Timestamp;

  @Column({ nullable: true })
  dispatchAt?: Timestamp;

  @Column({ nullable: true })
  deliveredAt?: Timestamp;

  @Column({ nullable: true })
  updatedAt?: Timestamp;
}

@Entity('freight_status_history')
export class FreightStatusHistoryEntity implements FreightStatusHistoryProto {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Index()
  @Column()
  freightBookingId!: string;

  @Column()
  status!: string;

  @Column({ nullable: true })
  note?: string;

  @Column({ nullable: true })
  actorId?: string;

  @Column({ nullable: true })
  changedAt?: Timestamp;
}

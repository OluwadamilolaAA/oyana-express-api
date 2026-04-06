import { ObjectId } from 'mongodb';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';
import type {
  Delivery as DeliveryProto,
  DeliveryAssignment as DeliveryAssignmentProto,
  DeliveryItem as DeliveryItemProto,
  DeliveryStatusHistory as DeliveryStatusHistoryProto,
  ProofOfDelivery as ProofOfDeliveryProto,
  Receiver as ReceiverProto,
} from '@package/packages/generated/delivery';
import type { Timestamp } from '@package/packages/generated/google/protobuf/timestamp';

@Entity('deliveries')
export class DeliveryEntity implements DeliveryProto {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Index()
  @Column()
  requesterId!: string;

  @Column()
  senderName!: string;

  @Column()
  senderPhone!: string;

  @Column()
  pickupAddress!: string;

  @Column()
  dropoffAddress!: string;

  @Column()
  pickupLatitude!: number;

  @Column()
  pickupLongitude!: number;

  @Column()
  dropoffLatitude!: number;

  @Column()
  dropoffLongitude!: number;

  @Column({ default: 'REQUESTED' })
  status!: string;

  @Column({ nullable: true })
  serviceLevel?: string;

  @Column({ nullable: true })
  scheduledFor?: Timestamp;

  @Column({ nullable: true })
  completedAt?: Timestamp;

  @Column({ nullable: true })
  createdAt?: Timestamp;

  @Column({ nullable: true })
  updatedAt?: Timestamp;
}

@Entity('delivery_items')
export class DeliveryItemEntity implements DeliveryItemProto {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Index()
  @Column()
  deliveryId!: string;

  @Column()
  name!: string;

  @Column({ default: 1 })
  quantity!: number;

  @Column({ nullable: true })
  weightKg?: number;

  @Column({ nullable: true })
  declaredValue?: number;

  @Column({ nullable: true })
  specialInstructions?: string;
}

@Entity('receivers')
export class ReceiverEntity implements ReceiverProto {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Index({ unique: true })
  @Column()
  deliveryId!: string;

  @Column()
  name!: string;

  @Column()
  phone!: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  verificationCode?: string;

  @Column({ nullable: true })
  relationship?: string;
}

@Entity('delivery_status_history')
export class DeliveryStatusHistoryEntity implements DeliveryStatusHistoryProto {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Index()
  @Column()
  deliveryId!: string;

  @Column()
  status!: string;

  @Column({ nullable: true })
  note?: string;

  @Column({ nullable: true })
  actorId?: string;

  @Column({ nullable: true })
  changedAt?: Timestamp;
}

@Entity('delivery_assignments')
export class DeliveryAssignmentEntity implements DeliveryAssignmentProto {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Index({ unique: true })
  @Column()
  deliveryId!: string;

  @Index()
  @Column()
  driverId!: string;

  @Column({ default: 'PENDING' })
  status!: string;

  @Column({ nullable: true })
  assignedAt?: Timestamp;

  @Column({ nullable: true })
  acceptedAt?: Timestamp;

  @Column({ nullable: true })
  pickedUpAt?: Timestamp;

  @Column({ nullable: true })
  deliveredAt?: Timestamp;

  @Column({ nullable: true })
  updatedAt?: Timestamp;
}

@Entity('proof_of_delivery')
export class ProofOfDeliveryEntity implements ProofOfDeliveryProto {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Index({ unique: true })
  @Column()
  deliveryId!: string;

  @Column()
  recipientName!: string;

  @Column({ nullable: true })
  signatureUrl?: string;

  @Column({ nullable: true })
  photoUrl?: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ nullable: true })
  capturedAt?: Timestamp;
}

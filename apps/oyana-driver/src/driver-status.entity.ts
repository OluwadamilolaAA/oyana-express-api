import { ObjectId } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectIdColumn,
} from 'typeorm';

export type DriverLifecycleStatus =
  | 'OFFLINE'
  | 'AVAILABLE'
  | 'ON_TRIP'
  | 'SUSPENDED'
  | 'ONBOARDING';

@Entity()
export class DriverStatus {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id() {
    return this._id.toString();
  }

  @Index()
  @Column()
  driverId!: string;

  @Column()
  status!: DriverLifecycleStatus;

  @Column({ default: false })
  isAvailable!: boolean;

  @Column({ nullable: true })
  reason?: string;

  @CreateDateColumn()
  changedAt!: Date;
}

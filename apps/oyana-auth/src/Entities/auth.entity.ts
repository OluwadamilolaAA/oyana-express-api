import { ObjectId } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

export type AuthStatus =
  | 'ACTIVE'
  | 'PENDING_VERIFICATION'
  | 'LOCKED'
  | 'DISABLED';
@Entity()
export class AuthIdentity {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id() {
    return this._id.toString();
  }

  @Column()
  userId!: string;

  @Column()
  email!: string;

  @Column()
  status!: AuthStatus;

  @Column({ default: 0 })
  failedLoginAttempts!: number;

  @Column({ nullable: true })
  lockedUntil!: Date;

  @Column({ nullable: true })
  lastLoginAt!: Date;

  @Column({ nullable: true })
  passwordChangedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

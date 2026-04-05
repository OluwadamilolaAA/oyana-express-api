import { ObjectId } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  Index,
} from 'typeorm';

export type OTPType =
  | 'EMAIL_VERIFICATION'
  | 'PHONE_VERIFICATION'
  | 'PASSWORD_RESET';

@Entity()
export class OtpVerification {
  @ObjectIdColumn()
  _id: ObjectId;

  get id() {
    return this._id.toString();
  }

  @Index()
  @Column()
  userId: string;

  @Index()
  @Column()
  code: string;

  @Index()
  @Column()
  type: OTPType;

  @Column()
  expiresAt: Date;

  @Column({ nullable: true })
  usedAt?: Date;

  @CreateDateColumn()
  createdAt: Date;
}

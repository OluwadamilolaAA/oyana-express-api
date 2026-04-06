import { ObjectId } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

export type KycVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

@Entity()
export class KycProfile {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id() {
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
  verificationStatus!: KycVerificationStatus;

  @Column({ nullable: true })
  selfieUrl?: string;

  @Column({ nullable: true })
  documentFrontUrl?: string;

  @Column({ nullable: true })
  documentBackUrl?: string;

  @Column({ nullable: true })
  verifiedAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

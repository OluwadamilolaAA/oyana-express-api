import { ObjectId } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class DriverDocument {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id() {
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
  verificationStatus!: 'PENDING' | 'VERIFIED' | 'REJECTED';

  @Column({ nullable: true })
  expiresAt?: Date;

  @CreateDateColumn()
  uploadedAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

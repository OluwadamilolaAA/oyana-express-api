import { ObjectId } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectIdColumn,
} from 'typeorm';

@Entity()
export class Session {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id() {
    return this._id.toString();
  }

  @Index()
  @Column()
  userId!: string;

  @Index()
  @Column()
  authIdentityId!: string;

  @Column()
  refreshTokenHash!: string;

  @Column({ nullable: true })
  userAgent?: string;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column()
  expiresAt!: Date;

  @Column({ nullable: true })
  lastActivityAt?: Date;

  @Column({ nullable: true })
  revokedAt?: Date;

  @Column({ nullable: true })
  revocationReason?: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;
}

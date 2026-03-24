import { ObjectId } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  Index,
} from 'typeorm';

export enum AuthEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  CREATE_ACCOUNT = 'CREATE_ACCOUNT',
  LOGOUT = 'LOGOUT',
  SESSION_REVOKED = 'SESSION_REVOKED',
  PASSWORD_RESET_REQUESTED = 'PASSWORD_RESET_REQUESTED',
}

@Entity()
export class AuthAuditLog {
  @ObjectIdColumn()
  _id: ObjectId;

  get id() {
    return this._id.toString();
  }

  @Index()
  @Column({ nullable: true })
  userId?: string;

  @Column()
  eventType: AuthEventType; 

  @Column({ nullable: true })
  ipAddress?: string; 

  @Column({ nullable: true })
  userAgent?: string;

  @Column({ nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
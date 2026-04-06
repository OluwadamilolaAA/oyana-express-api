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
export class UserPreference {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id() {
    return this._id.toString();
  }

  @Index({ unique: true })
  @Column()
  userId!: string;

  @Column({ default: 'en' })
  language!: string;

  @Column({ default: 'NGN' })
  currency!: string;

  @Column({ default: [] })
  notificationChannels!: string[];

  @Column({ default: [] })
  preferredVehicleTypes!: string[];

  @Column({ default: false })
  marketingOptIn!: boolean;

  @Column({ default: false })
  darkMode!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

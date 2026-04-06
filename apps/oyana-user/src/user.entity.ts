import {
  Entity,
  Column,
  ObjectIdColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { User as UserInterface } from '@package/packages';
import { ObjectId } from 'mongodb';

@Entity()
export class User implements UserInterface {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id() {
    return this._id.toString();
  }

  @Column({ length: 120 })
  name!: string;

  @Index({ unique: true })
  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column({ default: '' })
  phone!: string;

  @Column({ default: 'customer' })
  role!: 'customer' | 'admin' | 'driver';

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

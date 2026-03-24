import { Entity, Column, ObjectIdColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User as UserInterface } from '@package/packages';
import { ObjectId } from 'mongodb';

type UserGrpcCompatible = Omit<User, '_id'> & UserInterface;

@Entity()
export class User implements UserGrpcCompatible {
  @ObjectIdColumn({ name: 'id' })
  _id: ObjectId;

  get id() {
    return this._id.toString();
  }

  @Column({ length: 500 })
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phone: string;

  @Column()
  role: 'customer' | 'admin' | 'driver';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}

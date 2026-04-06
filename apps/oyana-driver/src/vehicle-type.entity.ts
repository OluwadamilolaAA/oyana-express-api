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
export class VehicleType {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id() {
    return this._id.toString();
  }

  @Index({ unique: true })
  @Column()
  code!: string;

  @Column()
  name!: string;

  @Column()
  category!: string;

  @Column({ default: 4 })
  maxPassengers!: number;

  @Column({ nullable: true })
  maxLoadKg?: number;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

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
export class Vehicle {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id() {
    return this._id.toString();
  }

  @Index({ unique: true })
  @Column()
  plateNumber!: string;

  @Column({ nullable: true })
  vin?: string;

  @Column()
  make!: string;

  @Column()
  model!: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  year?: number;

  @Column()
  vehicleTypeId!: string;

  @Column({ nullable: true })
  ownerDriverId?: string;

  @Column({ default: 'ACTIVE' })
  status!: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

import { ObjectId } from 'mongodb';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ObjectIdColumn,
} from 'typeorm';

@Entity()
export class DriverVehicleAssignment {
  @ObjectIdColumn({ name: 'id' })
  _id!: ObjectId;

  get id() {
    return this._id.toString();
  }

  @Index()
  @Column()
  driverId!: string;

  @Index()
  @Column()
  vehicleId!: string;

  @CreateDateColumn()
  assignedAt!: Date;

  @Column({ nullable: true })
  unassignedAt?: Date;

  @Column({ default: true })
  isActive!: boolean;
}

import { ObjectId } from 'mongodb';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';

@Entity()
export class DriverProfile {
  @ObjectIdColumn()
  _id: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Index({ unique: true })
  @Column()
  userId: string;

  @Column()
  vehicleType: string;

  @Index({ unique: true })
  @Column()
  licenseNumber: string;

  @Column({ default: true })
  isAvailable: boolean;
}
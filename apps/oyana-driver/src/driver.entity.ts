import { ObjectId } from 'mongodb';
import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';

@Entity()
export class DriverProfile {
  @ObjectIdColumn()
  _id!: ObjectId;

  get id(): string {
    return this._id.toString();
  }

  @Index({ unique: true })
  @Column()
  userId!: string;

  @Column()
  vehicleType!: string;

  @Index({ unique: true })
  @Column()
  licenseNumber!: string;

  @Column({ default: 'PENDING' })
  onboardingStatus!: 'PENDING' | 'IN_REVIEW' | 'COMPLETED';

  @Column({ default: 'PENDING' })
  approvalStatus!: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

  @Column({ default: 'OFFLINE' })
  currentStatus!: 'OFFLINE' | 'AVAILABLE' | 'ON_TRIP' | 'SUSPENDED';

  @Column({ nullable: true })
  activeVehicleAssignmentId?: string;

  @Column({ default: true })
  isAvailable!: boolean;
}

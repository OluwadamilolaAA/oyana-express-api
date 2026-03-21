import { Column, Entity, ObjectId, ObjectIdColumn } from "typeorm";

@Entity()
export class DriverProfile {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  userId: string; // reference to User

  @Column()
  vehicleType: string;

  @Column()
  licenseNumber: string;

  @Column({ default: true })
  isAvailable: boolean;
}
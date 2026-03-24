import { ObjectId } from "mongodb";
import { Column, CreateDateColumn, Entity, Index, ObjectIdColumn } from "typeorm";

@Entity()
export class Credential {
 @ObjectIdColumn({ name: 'id' })
    _id: ObjectId;
  
    get id() {
      return this._id.toString();
    }

  @Index()
  @Column()
  userId: string;

  @Index()
  @Column()
  authIdentityId: string;

  @Column()
  type: 'PASSWORD' | 'GOOGLE' | 'GITHUB';

  @Column({ nullable: true })
  passwordHash?: string;

  @Column({ nullable: true })
  providerId?: string;

  @Column({ default: false })
  isPrimary: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
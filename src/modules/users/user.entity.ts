import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Department } from 'modules/department/department.entity';
import { Roles } from './enums/roles.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.STUDENT,
  })
  role: Roles;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  middleName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  lastLogin: string;

  @ManyToOne(type => Department, department => department.users)
  department: Department;
}

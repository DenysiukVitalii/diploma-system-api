import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Department } from 'modules/department/department.entity';
import { Roles } from './enums/roles.enum';
import { TeacherLoad } from 'modules/teacherLoad/teacherLoad.entity';

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

  @Column({ nullable: true })
  middleName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true, select: false })
  password?: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isHead: boolean;

  @Column({ nullable: true })
  lastLogin: string;

  @Column({ nullable: true })
  departmentId: number;

  @ManyToOne(type => Department, department => department.users)
  department: Department;

  @OneToMany(type => TeacherLoad, teacherLoad => teacherLoad.user)
  teacherLoad: TeacherLoad[];
}

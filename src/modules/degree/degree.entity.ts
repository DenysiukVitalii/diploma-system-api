import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Department } from 'modules/department/department.entity';
import { User } from '../users/user.entity';

@Entity('degree')
export class Degree {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column({ nullable: true })
  departmentId: number;

  @OneToMany(type => User, user => user.degree)
  users: User[];

  @ManyToOne(type => Department, department => department.degrees)
  department: Department;
}

import { Specialty } from '../specialty/specialty.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AcademicDegree } from '../academicDegree/academicDegree.entity';
import { AcademicYear } from '../academicYear/academicYear.entity';
import { Department } from '../department/department.entity';
import { User } from '../users/user.entity';

@Entity('group')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  amountStudents: number;

  @Column({ nullable: true })
  departmentId: number;

  @Column({ nullable: true })
  academicYearId: number;

  @Column({ nullable: true })
  academicDegreeId: number;

  @Column({ nullable: true })
  specialtyId: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @OneToMany(type => User, user => user.group)
  users: User[];

  @ManyToOne(type => Department, department => department.groups)
  department: Department;

  @ManyToOne(type => AcademicYear, academicYear => academicYear.groups)
  academicYear: AcademicYear;

  @ManyToOne(type => AcademicDegree, academicDegree => academicDegree.groups)
  academicDegree: AcademicDegree;

  @ManyToOne(type => Specialty, specialty => specialty.groups)
  specialty: Specialty;
}

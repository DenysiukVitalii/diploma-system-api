import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AcademicDegree } from '../academicDegree/academicDegree.entity';
import { AcademicYear } from '../academicYear/academicYear.entity';
import { Department } from '../department/department.entity';
import { Request } from '../request/request.entity';
import { LaboratoryDirection } from '../laboratoryDirection/laboratoryDirection.entity';
import { User } from '../users/user.entity';

@Entity('theme')
export class Theme {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  isConfirmed: boolean;

  @Column({ nullable: true })
  studentId: number;

  @Column()
  teacherId: number;

  @Column({ nullable: true })
  departmentId: number;

  @Column({ nullable: true })
  academicYearId: number;

  @Column({ nullable: true })
  academicDegreeId: number;

  @Column({ nullable: true })
  laboratoryDirectionId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(type => Department, department => department.themes)
  department: Department;

  @ManyToOne(type => User, user => user.themes, { eager: true })
  student: User;

  @ManyToOne(type => User, user => user.themes, { eager: true })
  teacher: User;

  @ManyToOne(type => AcademicYear, academicYear => academicYear.themes)
  academicYear: AcademicYear;

  @ManyToOne(type => AcademicDegree, academicDegree => academicDegree.themes)
  academicDegree: AcademicDegree;

  @ManyToOne(type => LaboratoryDirection, laboratoryDirection => laboratoryDirection.themes, { eager: true })
  laboratoryDirection: LaboratoryDirection;

  @OneToMany(type => Request, request => request.theme)
  requests: Request[];
}

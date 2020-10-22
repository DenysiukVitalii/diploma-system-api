import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { AcademicDegree } from '../academicDegree/academicDegree.entity';
import { AcademicYear } from '../academicYear/academicYear.entity';
import { Department } from '../department/department.entity';

@Entity('schedule')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  departmentId: number;

  @Column({ nullable: true })
  academicYearId: number;

  @Column({ nullable: true })
  academicDegreeId: number;

  @ManyToOne(type => Department, department => department.schedules)
  department: Department;

  @ManyToOne(type => AcademicYear, academicYear => academicYear.schedules)
  academicYear: AcademicYear;

  @ManyToOne(type => AcademicDegree, academicDegree => academicDegree.schedules)
  academicDegree: AcademicDegree;
}

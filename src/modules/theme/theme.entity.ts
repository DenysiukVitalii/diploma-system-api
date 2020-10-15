import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { AcademicDegree } from 'modules/academicDegree/academicDegree.entity';
import { AcademicYear } from 'modules/academicYear/academicYear.entity';
import { Department } from 'modules/department/department.entity';

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

  @ManyToOne(type => Department, department => department.themes)
  department: Department;

  @ManyToOne(type => AcademicYear, academicYear => academicYear.themes)
  academicYear: AcademicYear;

  @ManyToOne(type => AcademicDegree, academicDegree => academicDegree.themes)
  academicDegree: AcademicDegree;
}

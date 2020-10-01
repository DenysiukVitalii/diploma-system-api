import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { AcademicDegree } from 'modules/academicDegree/academicDegree.entity';
import { AcademicYear } from 'modules/academicYear/academicYear.entity';
import { Department } from 'modules/department/department.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  amountStudents: number;

  @ManyToOne(type => Department, department => department.groups)
  department: Department;

  @ManyToOne(type => AcademicYear, academicYear => academicYear.groups)
  academicYear: AcademicYear;

  @ManyToOne(type => AcademicDegree, academicDegree => academicDegree.groups)
  academicDegree: AcademicDegree;
}

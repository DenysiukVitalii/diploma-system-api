import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Department } from 'modules/department/department.entity';
import { User } from 'modules/users/user.entity';
import { AcademicYear } from 'modules/academicYear/academicYear.entity';
import { AcademicDegree } from 'modules/academicDegree/academicDegree.entity';

@Entity('teacherLoad')
export class TeacherLoad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column({ nullable: true })
  academicYearId: number;

  @Column({ nullable: true })
  academicDegreeId: number;

  @Column({ nullable: true })
  departmentId: number;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(type => AcademicYear, academicYear => academicYear.teacherLoads)
  academicYear: AcademicYear;

  @ManyToOne(type => AcademicDegree, academicDegree => academicDegree.teacherLoads)
  academicDegree: AcademicDegree;

  @ManyToOne(type => Department, department => department.degrees)
  department: Department;

  @ManyToOne(type => User, user => user.teacherLoad)
  user: User;
}

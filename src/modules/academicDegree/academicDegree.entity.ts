import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Department } from '../department/department.entity';
import { Group } from '../group/group.entity';
import { TeacherLoad } from '../teacherLoad/teacherLoad.entity';
import { Theme } from '../theme/theme.entity';
import { Schedule } from '../schedule/schedule.entity';

@Entity('academicDegree')
export class AcademicDegree {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column({ nullable: true })
  departmentId: number;

  @ManyToOne(type => Department, department => department.academicDegrees)
  department: Department;

  @OneToMany(type => Group, group => group.academicDegree)
  groups: Group[];

  @OneToMany(type => TeacherLoad, teacherLoad => teacherLoad.academicDegree)
  teacherLoads: TeacherLoad[];

  @OneToMany(type => Theme, theme => theme.academicDegree)
  themes: Theme[];

  @OneToMany(type => Schedule, schedule => schedule.academicDegree)
  schedules: Schedule[];
}

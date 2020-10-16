import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Department } from 'modules/department/department.entity';
import { Group } from 'modules/group/group.entity';
import { TeacherLoad } from 'modules/teacherLoad/teacherLoad.entity';
import { Theme } from 'modules/theme/theme.entity';
import { Schedule } from 'modules/schedule/schedule.entity';

@Entity('academicYear')
export class AcademicYear {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column({ nullable: true })
  departmentId: number;

  @ManyToOne(type => Department, department => department.academicYears)
  department: Department;

  @OneToMany(type => Group, group => group.academicYear)
  groups: Group[];

  @OneToMany(type => TeacherLoad, teacherLoad => teacherLoad.academicYear)
  teacherLoads: TeacherLoad[];

  @OneToMany(type => Theme, theme => theme.academicYear)
  themes: Theme[];

  @OneToMany(type => Schedule, schedule => schedule.academicYear)
  schedules: Schedule[];
}

import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Degree } from '../degree/degree.entity';
import { AcademicDegree } from '../academicDegree/academicDegree.entity';
import { AcademicYear } from '../academicYear/academicYear.entity';
import { Laboratory } from '../laboratory/laboratory.entity';
import { Group } from '../group/group.entity';
import { Theme } from '../theme/theme.entity';
import { Schedule } from '../schedule/schedule.entity';
import { Specialty } from '../specialty/specialty.entity';
import { LaboratoryDirection } from 'modules/laboratoryDirection/laboratoryDirection.entity';

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(type => User, user => user.department)
  users: User[];

  @OneToMany(type => Degree, degree => degree.department)
  degrees: Degree[];

  @OneToMany(type => AcademicDegree, academicDegree => academicDegree.department)
  academicDegrees: AcademicDegree[];

  @OneToMany(type => AcademicYear, academicYear => academicYear.department)
  academicYears: AcademicYear[];

  @OneToMany(type => Laboratory, laboratory => laboratory.department)
  laboratories: Laboratory[];

  @OneToMany(type => LaboratoryDirection, laboratoryDirection => laboratoryDirection.department)
  laboratoryDirections: LaboratoryDirection[];

  @OneToMany(type => Group, group => group.department)
  groups: Group[];

  @OneToMany(type => Specialty, specialty => specialty.department)
  specialties: Specialty[];

  @OneToMany(type => Theme, theme => theme.department)
  themes: Theme[];

  @OneToMany(type => Schedule, schedule => schedule.department)
  schedules: Schedule[];
}

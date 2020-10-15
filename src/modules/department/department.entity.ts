import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from 'modules/users/user.entity';
import { Degree } from 'modules/degree/degree.entity';
import { AcademicDegree } from 'modules/academicDegree/academicDegree.entity';
import { AcademicYear } from 'modules/academicYear/academicYear.entity';
import { Laboratory } from 'modules/laboratory/laboratory.entity';
import { Group } from 'modules/group/group.entity';
import { Theme } from 'modules/theme/theme.entity';

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

  @OneToMany(type => Group, group => group.department)
  groups: Group[];

  @OneToMany(type => Theme, theme => theme.department)
  themes: Theme[];
}

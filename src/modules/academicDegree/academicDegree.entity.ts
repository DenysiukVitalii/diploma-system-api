import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Department } from 'modules/department/department.entity';
import { Group } from 'modules/group/group.entity';

@Entity('academicDegree')
export class AcademicDegree {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @ManyToOne(type => Department, department => department.academicDegrees)
  department: Department;

  @OneToMany(type => Group, group => group.academicYear)
  groups: Group[];
}
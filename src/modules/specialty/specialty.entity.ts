import { Group } from '../group/group.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Department } from '../department/department.entity';

@Entity('specialty')
export class Specialty {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  number: number;

  @Column({ nullable: true })
  departmentId: number;

  @ManyToOne(type => Department, department => department.specialties)
  department: Department;

  @OneToMany(type => Group, group => group.specialty)
  groups: Group[];
}

import {
  Entity, PrimaryGeneratedColumn,
  Column, ManyToOne,
} from 'typeorm';
import { Department } from 'modules/department/department.entity';

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
}

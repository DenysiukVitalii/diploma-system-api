import {
  Entity, PrimaryGeneratedColumn,
  Column, ManyToOne,
} from 'typeorm';
import { Department } from 'modules/department/department.entity';

@Entity('academicYear')
export class AcademicYear {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @ManyToOne(type => Department, department => department.academicYears)
  department: Department;
}

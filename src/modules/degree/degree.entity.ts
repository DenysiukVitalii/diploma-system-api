import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Department } from 'modules/department/department.entity';

@Entity('degree')
export class Degree {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column({ nullable: true })
  departmentId: number;

  @ManyToOne(type => Department, department => department.degrees)
  department: Department;
}

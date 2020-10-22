import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Department } from '../department/department.entity';
import { LaboratoryDirection } from '../laboratoryDirection/laboratoryDirection.entity';

@Entity('laboratory')
export class Laboratory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column({ nullable: true })
  departmentId: number;

  @ManyToOne(type => Department, department => department.laboratories)
  department: Department;

  @OneToMany(type => LaboratoryDirection, laboratoryDirection => laboratoryDirection.laboratory)
  laboratoryDirections: LaboratoryDirection[];
}

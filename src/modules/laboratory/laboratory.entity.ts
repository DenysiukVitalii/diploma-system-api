import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Department } from 'modules/department/department.entity';
import { LaboratoryDirection } from 'modules/laboratoryDirection/laboratoryDirection.entity';

@Entity('laboratory')
export class Laboratory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @ManyToOne(type => Department, department => department.laboratories)
  department: Department;

  @OneToMany(type => LaboratoryDirection, laboratoryDirection => laboratoryDirection.laboratory)
  laboratoryDirections: LaboratoryDirection[];
}

import { Specialty } from 'modules/specialty/specialty.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { AcademicDegree } from '../academicDegree/academicDegree.entity';
import { AcademicYear } from '../academicYear/academicYear.entity';
import { Department } from '../department/department.entity';
import { User } from '../users/user.entity';
import { Protection } from './protection.entity';

@Entity('protectionType')
export class ProtectionType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'timestamp' })
  dateStart: Date;

  @Column({ type: 'timestamp' })
  dateEnd: Date;

  @Column({ nullable: true })
  departmentId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(type => Department, department => department.protectionTypes)
  department: Department;

  @OneToMany(type => Protection, protection => protection.protectionType)
  protections: Protection[];
}

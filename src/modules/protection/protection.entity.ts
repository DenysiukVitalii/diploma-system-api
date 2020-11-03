import { Group } from 'modules/group/group.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Department } from '../department/department.entity';
import { ProtectionType } from './protectionType.entity';

@Entity('protection')
export class Protection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  place: string;

  @Column({ nullable: true })
  departmentId: number;

  @Column({ nullable: true })
  groupId: number;

  @Column({ nullable: true })
  studentIds: number[];

  @Column({ nullable: true })
  teacherIds: number[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(type => Department, department => department.groups)
  department: Department;

  @ManyToOne(type => Group, group => group.protections)
  group: Group;

  @ManyToOne(type => ProtectionType, protectionType => protectionType.protections)
  protectionType: ProtectionType;
}

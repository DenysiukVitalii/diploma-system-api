import { Group } from 'modules/group/group.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Department } from '../department/department.entity';
import { Comission } from './comission.entity';
import { ProtectionType } from './protectionType.entity';
import { StudentProtection } from './studentProtection.entity';

@Entity('protection')
export class Protection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  place: string;

  @Column({ nullable: true })
  groupId: number;

  @Column({ nullable: true })
  protectionTypeId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(type => Group, group => group.protections, { onDelete: 'CASCADE' })
  group: Group;

  @ManyToOne(type => ProtectionType, protectionType => protectionType.protections, { onDelete: 'CASCADE' })
  protectionType: ProtectionType;

  @OneToMany(type => Comission, comission => comission.protection)
  comissions: Comission[];

  @OneToMany(type => StudentProtection, studentProtection => studentProtection.protection)
  studentProtections: StudentProtection[];
}

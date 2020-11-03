import { Group } from 'modules/group/group.entity';
import { User } from 'modules/users/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Protection } from './protection.entity';

@Entity('comission')
export class Comission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  protectionId: number;

  @Column()
  teacherId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(type => Protection, protection => protection.comissions, { onDelete: 'CASCADE' })
  protection: Protection;

  @ManyToOne(type => User, user => user.comissions, { eager: true })
  teacher: User;
}

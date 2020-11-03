import { User } from 'modules/users/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Protection } from './protection.entity';

@Entity('studentProtection')
export class StudentProtection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  protectionId: number;

  @Column()
  studentId: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(type => Protection, protection => protection.studentProtections, { onDelete: 'CASCADE' })
  protection: Protection;

  @ManyToOne(type => User, user => user.studentProtections, { eager: true })
  student: User;
}

import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Theme } from '../theme/theme.entity';
import { User } from '../users/user.entity';
import { Statuses } from './enums/statuses.enum';

@Entity('request')
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Statuses,
    default: Statuses.PENDING,
  })
  status: Statuses;

  @Column()
  studentId: number;

  @Column()
  themeId: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @ManyToOne(type => User, student => student.requests, { eager: true })
  student: User;

  @ManyToOne(type => Theme, theme => theme.requests)
  theme: Theme;
}

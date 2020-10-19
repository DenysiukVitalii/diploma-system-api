import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Theme } from 'modules/theme/theme.entity';
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

  @ManyToOne(type => User, student => student.requests, { eager: true })
  student: User;

  @ManyToOne(type => Theme, theme => theme.requests)
  theme: Theme;
}

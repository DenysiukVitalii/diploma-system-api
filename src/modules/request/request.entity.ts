import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Theme } from 'modules/theme/theme.entity';
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

  @ManyToOne(type => Theme, theme => theme.requests)
  theme: Theme;
}

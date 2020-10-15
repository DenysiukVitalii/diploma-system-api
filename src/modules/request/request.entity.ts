import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Theme } from 'modules/theme/theme.entity';

@Entity('request')
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column()
  studentId: number;

  @Column()
  themeId: number;

  @ManyToOne(type => Theme, theme => theme.requests)
  theme: Theme;
}

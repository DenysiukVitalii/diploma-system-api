import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Laboratory } from '../laboratory/laboratory.entity';
import { Theme } from '../theme/theme.entity';

@Entity('laboratoryDirection')
export class LaboratoryDirection {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column({ nullable: true })
  laboratoryId: number;

  @ManyToOne(type => Laboratory, laboratory => laboratory.laboratoryDirections)
  laboratory: Laboratory;

  @OneToMany(type => Theme, theme => theme.laboratoryDirection)
  themes: Theme[];
}

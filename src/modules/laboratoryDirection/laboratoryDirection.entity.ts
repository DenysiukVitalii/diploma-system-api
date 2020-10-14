import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Laboratory } from 'modules/laboratory/laboratory.entity';

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
}

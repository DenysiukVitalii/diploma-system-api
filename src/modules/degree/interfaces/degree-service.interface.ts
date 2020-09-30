import { Degree } from '../degree.entity';
import { DegreeInterface } from './degree.interface';

export interface DegreeServiceInterface {
  findAll(): Promise<DegreeInterface[]>;
  create(data: DegreeInterface): Promise<Degree>;
  update(id: number, data: DegreeInterface): Promise<Degree>;
  delete(id: number): Promise<Degree>;
}

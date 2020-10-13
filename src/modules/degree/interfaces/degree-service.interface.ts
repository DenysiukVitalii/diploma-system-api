import { Degree } from '../degree.entity';
import { DegreeInterface } from './degree.interface';
import { User } from '../../users/user.entity';

export interface DegreeServiceInterface {
  findAll(): Promise<DegreeInterface[]>;
  create(data: DegreeInterface, user: User): Promise<Degree>;
  update(id: number, data: DegreeInterface): Promise<Degree>;
  delete(id: number): Promise<Degree>;
}

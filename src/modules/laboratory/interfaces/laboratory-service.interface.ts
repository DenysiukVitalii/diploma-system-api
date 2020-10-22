import { Laboratory } from '../laboratory.entity';
import { LaboratoryInterface } from './laboratory.interface';
import { User } from '../../users/user.entity';

export interface LaboratoryServiceInterface {
  findAll(): Promise<LaboratoryInterface[]>;
  create(data: LaboratoryInterface, user: User): Promise<Laboratory>;
  update(id: number, data: LaboratoryInterface): Promise<Laboratory>;
  delete(id: number): Promise<Laboratory>;
}

import { Laboratory } from '../laboratory.entity';
import { LaboratoryInterface } from './laboratory.interface';

export interface LaboratoryServiceInterface {
  findAll(): Promise<LaboratoryInterface[]>;
  create(data: LaboratoryInterface): Promise<Laboratory>;
  update(id: number, data: LaboratoryInterface): Promise<Laboratory>;
  delete(id: number): Promise<Laboratory>;
}

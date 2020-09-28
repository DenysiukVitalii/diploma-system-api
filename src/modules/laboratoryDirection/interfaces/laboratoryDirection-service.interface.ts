import { LaboratoryDirection } from '../laboratoryDirection.entity';
import { LaboratoryDirectionInterface } from './laboratoryDirection.interface';

export interface LaboratoryDirectionServiceInterface {
  findAll(): Promise<LaboratoryDirection[]>;
  create(data: LaboratoryDirectionInterface): Promise<LaboratoryDirection>;
  update(id: number, data: LaboratoryDirectionInterface): Promise<LaboratoryDirection>;
  delete(id: number): Promise<LaboratoryDirection>;
}

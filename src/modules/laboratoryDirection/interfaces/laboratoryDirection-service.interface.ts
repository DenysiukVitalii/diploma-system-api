import { User } from '../../users/user.entity';
import { LaboratoryDirection } from '../laboratoryDirection.entity';
import { LaboratoryDirectionInterface } from './laboratoryDirection.interface';

export interface LaboratoryDirectionServiceInterface {
  findAll(user: User): Promise<LaboratoryDirection[]>;
  create(data: LaboratoryDirectionInterface): Promise<LaboratoryDirection>;
  update(id: number, data: LaboratoryDirectionInterface): Promise<LaboratoryDirection>;
  delete(id: number): Promise<LaboratoryDirection>;
}

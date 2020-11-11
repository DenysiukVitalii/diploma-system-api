import { AcademicDegree } from '../academicDegree.entity';
import { AcademicDegreeInterface } from './academicDegree.interface';
import { User } from '../../users/user.entity';

export interface AcademicDegreeServiceInterface {
  findAll(user: User): Promise<AcademicDegreeInterface[]>;
  create(data: AcademicDegreeInterface, user: User): Promise<AcademicDegree>;
  update(id: number, data: AcademicDegreeInterface): Promise<AcademicDegree>;
  delete(id: number): Promise<AcademicDegree>;
}

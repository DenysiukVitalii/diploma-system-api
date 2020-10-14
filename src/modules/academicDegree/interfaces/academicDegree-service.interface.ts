import { AcademicDegree } from '../academicDegree.entity';
import { AcademicDegreeInterface } from './academicDegree.interface';
import { User } from 'modules/users/user.entity';

export interface AcademicDegreeServiceInterface {
  findAll(): Promise<AcademicDegreeInterface[]>;
  create(data: AcademicDegreeInterface, user: User): Promise<AcademicDegree>;
  update(id: number, data: AcademicDegreeInterface): Promise<AcademicDegree>;
  delete(id: number): Promise<AcademicDegree>;
}

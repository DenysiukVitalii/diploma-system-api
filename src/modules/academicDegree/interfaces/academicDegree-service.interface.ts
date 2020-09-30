import { AcademicDegree } from '../academicDegree.entity';
import { AcademicDegreeInterface } from './academicDegree.interface';

export interface AcademicDegreeServiceInterface {
  findAll(): Promise<AcademicDegreeInterface[]>;
  create(data: AcademicDegreeInterface): Promise<AcademicDegree>;
  update(id: number, data: AcademicDegreeInterface): Promise<AcademicDegree>;
  delete(id: number): Promise<AcademicDegree>;
}

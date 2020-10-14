import { AcademicYear } from '../academicYear.entity';
import { AcademicYearInterface } from './academicYear.interface';
import { User } from 'modules/users/user.entity';

export interface AcademicYearServiceInterface {
  findAll(): Promise<AcademicYearInterface[]>;
  create(data: AcademicYearInterface, user: User): Promise<AcademicYear>;
  update(id: number, data: AcademicYearInterface): Promise<AcademicYear>;
  delete(id: number): Promise<AcademicYear>;
}

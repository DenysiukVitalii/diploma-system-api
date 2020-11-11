import { AcademicYear } from '../academicYear.entity';
import { AcademicYearInterface } from './academicYear.interface';
import { User } from '../../users/user.entity';

export interface AcademicYearServiceInterface {
  findAll(user: User): Promise<AcademicYearInterface[]>;
  create(data: AcademicYearInterface, user: User): Promise<AcademicYear>;
  update(id: number, data: AcademicYearInterface): Promise<AcademicYear>;
  delete(id: number): Promise<AcademicYear>;
}

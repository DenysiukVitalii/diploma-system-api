import { AcademicYear } from '../academicYear.entity';
import { AcademicYearInterface } from './academicYear.interface';

export interface AcademicYearServiceInterface {
  findAll(): Promise<AcademicYearInterface[]>;
  create(data: AcademicYearInterface): Promise<AcademicYear>;
  update(id: number, data: AcademicYearInterface): Promise<AcademicYear>;
  delete(id: number): Promise<AcademicYear>;
}

import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Department } from 'modules/department/department.entity';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly amountStudents: number;

  @IsNumber()
  @IsNotEmpty()
  readonly departmentId: Department;

  @IsNumber()
  @IsNotEmpty()
  readonly academicYearId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly academicDegreeId: number;
}

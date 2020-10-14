import { IsNotEmpty, IsNumber } from 'class-validator';

export class TeacherLoadDto {
  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;

  @IsNumber()
  @IsNotEmpty()
  readonly academicYearId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly academicDegreeId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly userId: number;
}

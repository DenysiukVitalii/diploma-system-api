import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class AcademicDegreeDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly departmentId: number;
}

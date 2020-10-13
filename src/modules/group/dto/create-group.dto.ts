import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly amountStudents: number;

  @IsNumber()
  @IsNotEmpty()
  readonly academicYearId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly academicDegreeId: number;
}

import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateThemeDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly status: string;

  @IsNumber()
  readonly studentId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly laboratoryDirectionId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly academicYearId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly academicDegreeId: number;
}

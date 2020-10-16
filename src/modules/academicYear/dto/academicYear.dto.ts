import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class AcademicYearDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}

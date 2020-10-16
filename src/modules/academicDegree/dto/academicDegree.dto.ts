import { IsString, IsNotEmpty } from 'class-validator';

export class AcademicDegreeDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}

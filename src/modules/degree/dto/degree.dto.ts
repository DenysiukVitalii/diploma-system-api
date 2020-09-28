import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class DegreeDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly departmentId: number;
}

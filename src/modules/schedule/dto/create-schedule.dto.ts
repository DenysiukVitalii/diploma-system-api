import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly startDate: string;

  @IsString()
  @IsNotEmpty()
  readonly endDate: string;

  @IsString()
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  readonly academicYearId: number;

  @IsNumber()
  @IsNotEmpty()
  readonly academicDegreeId: number;
}

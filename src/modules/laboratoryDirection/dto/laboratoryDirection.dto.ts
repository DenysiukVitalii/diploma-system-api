import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class LaboratoryDirectionDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly laboratoryId: number;
}

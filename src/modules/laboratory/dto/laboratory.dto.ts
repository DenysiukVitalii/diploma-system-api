import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class LaboratoryDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
}

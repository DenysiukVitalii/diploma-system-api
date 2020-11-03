import { IsString, IsNotEmpty, IsDate } from 'class-validator';

export class CreateProtectionTypeDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsDate()
  @IsNotEmpty()
  readonly dateStart: Date;

  @IsDate()
  @IsNotEmpty()
  readonly dateEnd: Date;
}

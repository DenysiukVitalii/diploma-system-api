import { Roles } from '../enums/roles.enum';

export class CreateUserDto {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  isHead?: boolean = false;
  departmentId: number;
}

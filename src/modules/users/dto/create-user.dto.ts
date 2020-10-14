import { Roles } from '../enums/roles.enum';

export class CreateUserDto {
  firstName: string;
  lastName: string;
  middleName: string;
  role: Roles;
  email: string;
}

import { SetMetadata } from '@nestjs/common';

export const OnlyForRoles = (...roles: string[]) => SetMetadata('roles', roles);

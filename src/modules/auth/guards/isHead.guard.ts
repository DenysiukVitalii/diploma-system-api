import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'modules/users/enums/roles.enum';

@Injectable()
export class IsHeadGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return user && user.role && user.role === Roles.TEACHER && user.isHead === true;
  }
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEYS } from '../role.decorator';
import { Request } from 'express';

// reflector is used to read metadata attached with the functions and classes...

// canActivate ake interface h jiska kaam h ki decide krna wether a request will reach to the controller or not..

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEYS,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    // this acts likes a express request, from where we fetches the all details
    const user = request.user as { email: string; sub: string; role: string };
    return requiredRoles.includes(user.role);
  }
}

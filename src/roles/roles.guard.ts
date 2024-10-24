import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * Guard that checks if the user has the required roles to access a route.
 *
 * @class
 * @implements {CanActivate}
 *
 * @constructor
 * @param {Reflector} reflector - The reflector service used to get metadata.
 *
 * @method
 * @name canActivate
 * @memberof RolesGuard
 * @param {ExecutionContext} context - The execution context of the request.
 * @returns {boolean} - Returns `true` if the user has one of the required roles, otherwise `false`.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getClass(),
      context.getHandler(),
    ]);
    if (!roles.length) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    return roles.map(String).includes(String(request.user?.role?.name));
  }
}

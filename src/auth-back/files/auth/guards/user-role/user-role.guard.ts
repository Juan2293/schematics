import { Reflector } from '@nestjs/core';
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { META_PERMISSIONS } from '../../decorators/role-protected.decorator';


@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const validPermissions: string[] = this.reflector.getAllAndOverride(META_PERMISSIONS, [
      context.getHandler(), //validación a nivel de función en el controller
      context.getClass() //para hacer la validación a nivel de clase controller
      ]);

    if(!validPermissions || validPermissions.length===0){
      return true
    }

    const { user } = context.switchToHttp().getRequest();

    if( !user )
      throw new BadRequestException('User not found');

    const userPermissions = user.permissions || [];

    for (const permission of userPermissions) {
      if(validPermissions.includes(permission)){
        return true;
      }
    }
    throw new ForbiddenException(
      `User ${user.name} need a valid role: [${validPermissions}]`
    )
  }


}

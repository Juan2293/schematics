import { SetMetadata } from '@nestjs/common';
import { ValidPermissions } from '../interfaces/valid-roles';

export const META_PERMISSIONS= 'permissions';

export const PermissionProtected = (...args: ValidPermissions[]) => {

   return SetMetadata(META_PERMISSIONS, args);
}

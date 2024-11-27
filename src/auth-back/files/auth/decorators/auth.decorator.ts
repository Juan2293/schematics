import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserRoleGuard } from "../guards/user-role/user-role.guard";
import { ValidPermissions } from "../interfaces/valid-roles";
import { PermissionProtected } from "./role-protected.decorator";

export function Auth(...permissions: ValidPermissions[]){

    return applyDecorators(
        PermissionProtected(...permissions),
        UseGuards( AuthGuard(), UserRoleGuard)
    )
}
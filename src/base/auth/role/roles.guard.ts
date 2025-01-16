import { Reflector } from "@nestjs/core"
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

import { Role } from "./role.enum"
import { ROLES_KEY } from "./roles.decorator"

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
    ) {
        console.log("RolesGuard: Constructor")
    }

    canActivate(context: ExecutionContext): boolean {
        console.log("RolesGuard: canActivate")
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(), 
            context.getClass()
        ])

        console.log(requiredRoles)
        if (!requiredRoles) {
            console.log("Not Require Roles")
            return true
        }

        const request = context.switchToHttp().getRequest()
        const authorization = request.header('Authorization');
        console.log("authorization: ", authorization)
        if(!authorization) {
            throw new UnauthorizedException('Authorization: Bearer <token> header missing')
        }

        const parts = authorization.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            throw new UnauthorizedException('Authorization: Bearer <token> header missing')
        }

        const token = parts[1];
        const user = this.jwtService.decode(token)
        console.log("user: ", user)

        return requiredRoles.some((role) => user.roles?.includes(role))
    }
}

import { Reflector } from "@nestjs/core"
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common"
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
        console.log("canActivate")
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
        const header = request.header('Authorization');
        console.log("header: ", header)

        // Used JwtGuard
        // if (!header) {
        //     throw new HttpException('Authorization: Bearer <token> header missing', HttpStatus.UNAUTHORIZED);
        // }

        const parts = header.split(' ');

        // Used JwtGuard
        // if (parts.length !== 2 || parts[0] !== 'Bearer') {
        //     throw new HttpException('Authorization: Bearer <token> header invalid', HttpStatus.UNAUTHORIZED);
        // }

        const token = parts[1];
        const user = this.jwtService.decode(token)
        console.log("user: ", user)

        return requiredRoles.some((role) => user.roles?.includes(role))
    }
}

import { Reflector } from "@nestjs/core"
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, Logger } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

import { Role } from "./role.enum"
import { ROLES_KEY } from "./roles.decorator"

@Injectable()
export class RolesGuard implements CanActivate {
    private readonly logger = new Logger(RolesGuard.name, { timestamp: true })

    constructor(
        private readonly reflector: Reflector,
        private readonly jwtService: JwtService,
    ) {
        this.logger.log("RolesGuard initialized")
    }

    canActivate(context: ExecutionContext): boolean {
        this.logger.log("RolesGuard canActivate")

        // Get the required roles from the metadata of the handler or class
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()])

        this.logger.log("Roles Request: " + requiredRoles)

        // If no roles are required, allow access
        if (!requiredRoles) {
            this.logger.log("Not Require Roles")
            return true
        }

        // Extract the JWT token from the Authorization header
        const request = context.switchToHttp().getRequest()
        const authorization = request.header("Authorization")
        this.logger.log("Authorization: " + authorization)

        // If the Authorization header is missing or malformed, throw an UnauthorizedException
        if (!authorization) {
            throw new UnauthorizedException("Authorization: Bearer <token> header missing")
        }

        // Split the Authorization header to get the token
        // Expected format: "Bearer <token>"
        const parts = authorization.split(" ")

        // If the format is incorrect, throw an UnauthorizedException
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            throw new UnauthorizedException("Authorization: Bearer <token> header missing")
        }

        // Decode the JWT token to get the user information
        // Note: This does not verify the token; it only decodes it.
        const token = parts[1]
        const user = this.jwtService.decode(token)

        // If the user information is not present in the token, throw an UnauthorizedException
        this.logger.log("User Data: " + JSON.stringify(user))
        if (!requiredRoles.some((role) => user.roles?.includes(role))) {
            this.logger.error("User does not have required roles")
            // throw new UnauthorizedException("User does not have required roles")
        }

        return requiredRoles.some((role) => user.roles?.includes(role))
    }
}

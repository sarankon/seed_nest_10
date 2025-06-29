import { Injectable, Logger } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

import { EntityManager, MikroORM } from "@mikro-orm/core"
import { InjectEntityManager, InjectMikroORM } from "@mikro-orm/nestjs"

// UUID
// Using v7 for UUID generation as per the latest standards
import { v7 as uuidv7 } from "uuid"

// Configuration
import jwtConfig from "src/config/jwt.config"

// Services
import { UserService } from "src/base/user/user.service"

// Data Transfer Objects (DTOs)
import { UserDto } from "src/base/authentication/dto/user.dto"
import { ResponseBody } from "src/base/response-body"

@Injectable()
export class AuthenticationService {
    // Logger
    // Using Logger to log messages with timestamps
    private readonly logger = new Logger(AuthenticationService.name, { timestamp: true })

    constructor(
        private readonly jwtService: JwtService,
        @InjectMikroORM("postgreSql") private readonly mikroOrm: MikroORM,
        @InjectEntityManager("postgreSql") private readonly entityManager: EntityManager,
    ) {
        this.logger.log("AuthenticationService initialized")
    }

    // JWT Functionality
    async login(user: UserDto) {
        this.logger.log(`User Login Request: ${user.username}`)
        this.logger.log(`User Login Request: ${user.uuid}`)

        // Set User Roles, Groups, and Organization
        // Initialize arrays for roles and groups, and a string for organization
        const roles: Array<string> = []
        const groups: Array<string> = []
        let organization: string = ""

        // Check if user has roles, groups, and organization
        if (user.roles) {
            for (const role of user.roles) {
                roles.push(role["name"])
            }
        }

        if (user.groups) {
            for (const group of user.groups) {
                groups.push(group["name"])
            }
        }

        if (user.organization) {
            organization = user.organization["name"]
        }

        // Set Payload for JWT
        const payload = {
            uuid: user.uuid,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            roles: roles,
            groups: groups,
            organization: organization,
            tokenUuid: uuidv7(),
        }

        // Generate JWT Token
        const access_token = this.jwtService.sign(payload, {
            expiresIn: jwtConfig.expiresIn,
        })

        // Generate Refresh Token
        const refresh_token = this.jwtService.sign(payload, {
            expiresIn: jwtConfig.expiresIn,
        })

        const data = {
            access_token: access_token,
            refresh_token: refresh_token,
        }
        return new ResponseBody(200, data)
    }

    async logout() {
        // Revoke Access Token and Refresh Token
        return new ResponseBody(200, {})
    }

    async isAuthenticated() {
        return new ResponseBody(200, {
            isAuthenticated: true,
        })
    }

    async refreshToken() {
        // Rotate Token
        return "Rotate"
    }

    async infoUser(user: UserDto) {
        // User Info
        return new ResponseBody(200, user)
    }

    async infoAdmin(user: UserDto) {
        // Admin Info
        return new ResponseBody(200, user)
    }
}

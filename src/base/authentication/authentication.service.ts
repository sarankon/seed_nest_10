import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import jwtConfig from "../../config/jwt.config"

import { EntityManager, MikroORM } from "@mikro-orm/core"
import { InjectEntityManager, InjectMikroORM } from "@mikro-orm/nestjs"
import { v7 as uuidv7 } from "uuid"

import { UserService } from "../user/user.service"
import { UserDto } from "./dto/user.dto"
// import { Role } from "./role/role.enum"
import { ResponseBody } from "../response-body"

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @InjectMikroORM("postgreSql") private readonly mikroOrm: MikroORM,
        @InjectEntityManager("postgreSql") private readonly entityManager: EntityManager,
    ) {}

    // Local Strategy (validate) -> validateUser
    async validateUser(username: string, password: string) {
        const user = await this.userService.findByUsername(username)
        if (user) {
            const isMatch = await this.userService.isMatchPassword(password, user.password)
            console.log("isMatch: ", isMatch)

            // If Match -> @Request
            if (isMatch) {
                return user
            } else {
                return null
            }
        } else {
            return null
        }
    }

    // JWT Functionality
    async login(user: UserDto) {
        // console.log('Login: ', user)
        const roles: Array<string> = []

        if (user.roles) {
            for (const role of user.roles) {
                // console.log(role['name'])
                roles.push(role["name"])
            }
        }

        const payload = {
            uuid: user.uuid,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            roles: roles,
        }

        const data = {
            access_token: this.jwtService.sign(payload, {
                expiresIn: jwtConfig.expiresIn,
            }),
            refresh_token: "",
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
}

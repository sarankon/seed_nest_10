import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import jwtConfig from "../../config/jwt.config"

import { UserService } from "../user/user.service"
import { UserDto } from "./dto/user.dto"
import { Role } from "./role/role.enum"

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    // Local Strategy (validate) -> validateUser
    async validateUser(username: string, password: string) {
        const user = await this.userService.findByUsername(username)
        if (user) {
            const isMatch = await this.userService.isMatchPassword(password, user.password)
            console.log("isMatch: ", isMatch)

            // If Match -> @Request
            if(isMatch) {
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
        const payload = {
            uuid: user.uuid,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            roles: [Role.User, Role.Admin]
        }

        return {
            access_token: this.jwtService.sign(payload, {
                expiresIn: jwtConfig.expiresIn
            }),
        }
    }

    async logout() {}

    async register() {}
}

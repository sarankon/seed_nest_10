import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

import { UserService } from "../user/user.service"
import { UserDto } from "./dto/user.dto"

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string) {
        const user = await this.userService.findByUsername(username)
        // if (user && user.password === password) {
        //     const { password, ...result } = user
        //     return result
        // }
        return null
    }

    // JWT Functionality
    async login(user: UserDto) {
        const payload = { 
            username: user.username
        }
        return {
            access_token: this.jwtService.sign(payload),
        }
    }

    async logout() {

    }

    async register() {

    }

}

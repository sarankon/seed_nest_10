import { Injectable, NotFoundException } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-local"
import { AuthService } from "../auth.service"

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super()
        console.log("LocalStrategy: Constructor")
    }

    async validate(username: string, password: string) {
        console.log("LocalStrategy: validate")
        const user = await this.authService.validateUser(username, password)
        
        if (user) {
            return user
        } else {
            throw new NotFoundException(`Data #username:'${username}' Not Found`)
        }
    }
}

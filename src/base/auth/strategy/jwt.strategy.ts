import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import jwtConfig from "../../../config/jwt.config"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConfig.secret,
            ignoreExpiration: false,
        })
    }

    async validate(payload: any) {
        console.log("JwtStrategy: (validate)")
        console.log("payload:", payload)
        return payload
    }
}

import { Injectable, Logger } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"

// Passport JWT Strategy
import { ExtractJwt, Strategy } from "passport-jwt"

// JWT Configuration
import jwtConfig from "src/config/jwt.config"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name, { timestamp: true })

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtConfig.secret,
            ignoreExpiration: false,
        })
    }

    async validate(payload: any) {
        console.log("JwtStrategy: (validate) -> @Request request.user")
        console.log("payload:", payload)
        // payload['edited'] = 'from validate at JwtStrategy'
        return payload
    }
}

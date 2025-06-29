import { APP_GUARD } from "@nestjs/core"
import { Module } from "@nestjs/common"

// Service and Controller
import { AuthenticationService } from "./authentication.service"
import { AuthenticationController } from "./authentication.controller"

// Passport
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"

// Local Strategy
import { LocalStrategy } from "./strategy/local.strategy"

// JWT (Javascript Web Token)
import jwtConfig from "src/config/jwt.config"
import { JwtStrategy } from "./strategy/jwt.strategy"

// Guards
import { RolesGuard } from "./role/roles.guard"

// Services
import { UserService } from "../user/user.service"

@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: jwtConfig.secret,
            // signOptions: { expiresIn: '120s' },
        }),
    ],
    controllers: [AuthenticationController],
    providers: [
        UserService,
        AuthenticationService,
        LocalStrategy,
        JwtStrategy,
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
    exports: [],
})
export class AuthenticationModule {}

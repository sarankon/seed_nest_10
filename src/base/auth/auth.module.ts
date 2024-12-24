import { Module } from '@nestjs/common'

// Service and Controller
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller';

// Passport
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './strategy/local.strategy'

// JWT (Javascript Web Token)
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from 'src/config/jwt.config'
import { JwtStrategy } from './strategy/jwt.strategy'
import { UserService } from '../user/user.service';


@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '120s' },
        }),
    ],
    controllers: [
        AuthController
    ],
    providers: [
        UserService,
        AuthService, 
        LocalStrategy,
        JwtStrategy,
    ],
    exports: []
})
export class AuthModule {}

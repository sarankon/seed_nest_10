import { Module } from '@nestjs/common'

// Service and Controller
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller';

// Passport
import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './strategy/local.strategy'

// JWT (Javascript Web Token)
import { JwtModule } from '@nestjs/jwt'
import jwtConfig from 'src/config/jwt.config'
import { JwtStrategy } from './strategy/jwt.strategy'
import { UserService } from '../user/user.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './role/roles.guard';


@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: jwtConfig.secret,
            // signOptions: { expiresIn: '120s' },
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
        {
            provide: APP_GUARD,
            useClass: RolesGuard
        }
    ],
    exports: []
})
export class AuthModule {}

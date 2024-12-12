# Passport (Auth)
Reference: https://docs.nestjs.com/recipes/passport

``` bash
npm install --save @nestjs/passport passport passport-local
npm install --save-dev @types/passport-local
```

## User Service
``` bash
nest generate module core/users
nest generate service core/users
```

Create File :page_with_curl: user-login.dto.ts
``` ts
// This should be a real class/interface representing a user entity
export class UserLogin {
    username!:string
    password!:string
};
```

Edit File :page_with_curl: users.service.ts
``` ts
import { Injectable } from '@nestjs/common'
import { UserLogin } from './user-login.dto'


@Injectable()
export class UsersService {
    private readonly users = [
        {
          id: 1,
          username: 'user',
          password: 'pass',
        }
    ];

    async findOne(username: string): Promise<UserLogin | undefined> {
        return this.users.find(user => user.username === username)
    }
}
```

Edit File :page_with_curl: users.module.ts
``` ts
import { Module } from '@nestjs/common'
import { UsersService } from './users.service'


@Module({
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
```

## Authen Service (Local Strategy)
Create File :page_with_curl: local.strategy.ts
``` ts
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from './auth.service'


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private authService: AuthService) {
        super()
    }

    async validate(username: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(username, password)
        if (!user) {
        throw new UnauthorizedException()
    }
    return user
  }
  
}
```

Create File :page_with_curl: local-auth.guard.ts
``` ts
import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'


@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
```

``` bash
nest generate module core/auth
nest generate service core/auth
```

Edit File :page_with_curl: auth.service.ts
``` ts
import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'


@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findOne(username)
        if (user && user.password === password) {
          const { password, ...result } = user
          return result
        }
        return null
    }
}
```

Edit File :page_with_curl: auth.module.ts
``` ts
import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from '../users/users.module'
import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'

@Module({
    imports: [UsersModule, PassportModule],
    providers: [AuthService, LocalStrategy]
})
export class AuthModule {}
```

Edit File :page_with_curl: app.controller.ts
``` ts
    //...

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    @ApiBasicAuth()
    @ApiBody({type: UserLogin})
    async login(@Request() req) {
        console.log('Login User: ', req.user)
        return req.user
    }


    @UseGuards(LocalAuthGuard)
    @Post('auth/logout')
    @ApiBasicAuth()
    @ApiBody({type: UserLogin})
    async logout(@Request() req) {
        console.log('Logout User: ', req.user)
        return req.logout();
    }

    //...
```

## Authen Service (JWT Strategy)
``` bash
npm install --save @nestjs/jwt passport-jwt
npm install --save-dev @types/passport-jwt
```

Create File :page_with_curl: jwt.config.ts
``` ts
export const jwtConstants = {
    secret: 'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};
```

Edit File :page_with_curl: jwt.strategy.ts
``` ts
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { jwtConstants } from '../../config/jwt.config'


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        });
    }

    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
    
}
```

Edit File :page_with_curl: jwt-auth.guard.ts
``` ts
import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

Edit File :page_with_curl: auth.service.ts
``` ts 
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../users/users.service'
import { User } from '../users/user.dto'


@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findOne(username)
        if (user && user.password === password) {
            const { password, ...result } = user
            return result
        }
        return null
    }

    // JWT Functionality
    async login(user: User) {
        const payload = { username: user.username, sub: user.userId }
        return {
            access_token: this.jwtService.sign(payload),
        }
    }

}
```

Edit File :page_with_curl: auth.module.ts
``` ts
import { Module } from '@nestjs/common'
import { UsersModule } from '../users/users.module'
import { AuthService } from './auth.service'

import { PassportModule } from '@nestjs/passport'
import { LocalStrategy } from './local.strategy'

import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from 'src/config/jwt.config'
import { JwtStrategy } from './jwt.strategy'


@Module({
    imports: [
        UsersModule, 
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60s' },
        }),
    ],
    providers: [
        AuthService, 
        LocalStrategy,
        JwtStrategy
    ],
    exports: [
        AuthService
    ]
})
export class AuthModule {}
```

Edit File :page_with_curl: app.controller.ts
``` ts
    // ...

    @UseGuards(LocalAuthGuard)
    @Post('auth/login')
    @ApiBody({type: UserLogin})
    async login(@Request() req) {
        console.log('Login User: ', req.user)
        return this.authService.login(req.user);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiBearerAuth()
    getProfile(@Request() req) {
        console.log('Profile User: ', req.user)
        return req.user;
    }

    // ...
```
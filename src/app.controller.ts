import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger'
import { AppService } from './app.service'
import { UserLogin } from './core/users/user-login.dto'
import { LocalAuthGuard } from './core/auth/local-auth.guard'
import { AuthService } from './core/auth/auth.service'
import { JwtAuthGuard } from './core/auth/jwt-auth.guard'


@Controller()
export class AppController {
  
    constructor(
        private readonly appService: AppService,
        private authService: AuthService
    ) {}

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

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

}



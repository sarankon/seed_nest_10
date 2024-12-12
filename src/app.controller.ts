import { Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBasicAuth, ApiBody } from '@nestjs/swagger';
import { UserLogin } from './core/users/user-login.dto';
import { LocalAuthGuard } from './core/auth/local-auth.guard';


@Controller()
export class AppController {
  
    constructor(
        private readonly appService: AppService
    ) {}


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


    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

}



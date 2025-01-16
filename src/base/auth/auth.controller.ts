import { Controller, Post, UseGuards, Request, Get, Body } from "@nestjs/common"
import { ApiBearerAuth, ApiBody, ApiOperation } from "@nestjs/swagger"

import { UserService } from "../user/user.service"
import { AuthService } from "./auth.service"
import { LocalAuthGuard } from "./strategy/local-auth.guard"
import { JwtAuthGuard } from "./strategy/jwt-auth.guard"

import { Roles } from "./role/roles.decorator"
import { Role } from "./role/role.enum"

import { CreateUserDto } from "../user/dto/create-user.dto"
import { UserLoginDto } from "./dto/login-user.dto"
import { OrganizationCreateDto } from "./dto/org-create.dto"
// import { UserLogoutDto } from "./dto/logout-user.dto"

@Controller("auth")
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) {}

    @Post("register")
    register(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto)
    }

    @UseGuards(LocalAuthGuard)
    @Post("login")
    @ApiBody({ type: UserLoginDto })
    login(@Request() request) {
        console.log("User Login: ", request.user)
        return this.authService.login(request.user)
    }

    @UseGuards(JwtAuthGuard)
    @Post("logout")
    @ApiBearerAuth()
    logout(@Request() request) {
        console.log("User Logout: ", request.user)
        return this.authService.logout()
    }

    @UseGuards(JwtAuthGuard)
    @Post("isAuthenticated")
    @ApiBearerAuth()
    isAuthenticated(@Request() request) {
        console.log("User is Authenticated")
        return this.authService.isAuthenticated()
    }

    @UseGuards(JwtAuthGuard)
    @Post("refreshToken")
    @ApiBearerAuth()
    refreshToken(@Request() request) {
        console.log("User Rotate Token: ")
        return this.authService.refreshToken()
    }

    @UseGuards(JwtAuthGuard)
    @Get("info")
    @ApiBearerAuth()
    infoUser(@Request() request) {
        console.log("Profile User: ", request.user)
        return request.user
    }

    @UseGuards(JwtAuthGuard)
    @Get("admin")
    @Roles(Role.Admin)
    @ApiBearerAuth()
    infoAdmin(@Request() request) {
        console.log("Role Admin: ", request.user)
        return request.user
    }

    // Organization (Create, Read, Update, Delete)
    @UseGuards(JwtAuthGuard)
    @Post('orgCreate')
    @ApiBearerAuth()
    createOrg(@Request() request, @Body() createDto: OrganizationCreateDto) {
        console.log('User: ', request.user)
        return this.authService.createOrg(createDto)
    }

    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    // findOneOrg(@Request() request) {
        
    // }

    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    // findAllOrg(@Request() request) {
        
    // }

    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    // updateOrg(@Request() request) {
        
    // }

    // @UseGuards(JwtAuthGuard)
    // @ApiBearerAuth()
    // removeOrg(@Request() request) {

    // }

    // Roles (Create, Update, Delete)


    // Group (Create, Update, Delete)
}

import { Controller, Injectable, Logger, Post, Request, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger"

// Service and Guards
import { AuthenticationService } from "./authentication.service"
import { LocalAuthGuard } from "./strategy/local-auth.guard"
import { JwtAuthGuard } from "./strategy/jwt-auth.guard"

// Decorators for Roles
import { Roles } from "./role/roles.decorator"
// Enum for Roles
import { Role } from "./role/role.enum"

// Data Transfer Object (DTO) for User Login
import { LoginUserDto } from "./dto/login-user.dto"

@Injectable()
@Controller("authentication")
export class AuthenticationController {
    // Logger
    // Using Logger to log messages with timestamps
    private readonly logger = new Logger(AuthenticationController.name, { timestamp: true })

    // Constructor
    constructor(private readonly authenticationService: AuthenticationService) {
        this.logger.log("AuthenticationController initialized")
    }

    // Login User
    // This endpoint is used to log in the user and generate a JWT token
    @ApiBody({ type: LoginUserDto })
    @UseGuards(LocalAuthGuard)
    @Post("login")
    login(@Request() request) {
        this.logger.log("User Login Request: " + request.user.username)
        this.logger.log("User Login Request: " + request.user.uuid)

        return this.authenticationService.login(request.user)
    }

    // Logout User
    // This endpoint is used to log out the user by invalidating the JWT token
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post("logout")
    logout(@Request() request) {
        this.logger.log("User Logout Request: " + request.user.username)
        this.logger.log("User Logout Request: " + request.user.uuid)

        return this.authenticationService.logout()
    }

    // Refresh Token
    // This endpoint is used to refresh the JWT token for the user
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post("refreshToken")
    refreshToken(@Request() request) {
        this.logger.log("User Refresh Token Request: " + request.user.username)
        this.logger.log("User Refresh Token Request: " + request.user.uuid)

        return this.authenticationService.refreshToken()
    }

    // Check User Authentication
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post("isAuthenticated")
    isAuthenticated(@Request() request) {
        this.logger.log("Check User Authentication: " + request.user.username)
        this.logger.log("Check User Authentication: " + request.user.uuid)

        return this.authenticationService.isAuthenticated()
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post("infoUser")
    infoUser(@Request() request) {
        this.logger.log("User Info Request: " + request.user.username)
        this.logger.log("User Info Request: " + request.user.uuid)

        return this.authenticationService.infoUser(request.user)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    @Post("infoAdmin")
    infoAdmin(@Request() request) {
        this.logger.log("Admin Info Request: " + request.user.username)
        this.logger.log("Admin Info Request: " + request.user.uuid)

        return this.authenticationService.infoAdmin(request.user)
    }
}

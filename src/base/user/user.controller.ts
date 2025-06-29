import { Body, Controller, Injectable, Logger, Post, Request, UseGuards } from "@nestjs/common"
import { ApiBearerAuth } from "@nestjs/swagger"

// Guards
import { JwtAuthGuard } from "src/base/authentication/strategy/jwt-auth.guard"
import { Roles } from "src/base/authentication/role/roles.decorator"
import { Role } from "src/base/authentication/role/role.enum"

// Services
import { UserService } from "src/base/user/user.service"

// Data Transfer Objects (DTOs)
import { CreateUserDto } from "src/base/user/dto/create-user.dto"
import { UpdateUserDto } from "src/base/user/dto/update-user.dto"

@Injectable()
@Controller("user")
export class UserController {
    // Logger
    // Using Logger to log messages with timestamps
    private readonly logger = new Logger(UserController.name, { timestamp: true })

    // Constructor
    constructor(private readonly userService: UserService) {
        this.logger.log("UserController initialized")
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    @Post("create")
    create(@Body() createUserDto: CreateUserDto, @Request() request) {
        return this.userService.create(createUserDto, request.user)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    @Post("find-all")
    findAll(@Request() request) {
        return this.userService.findAll(request.user)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    @Post("find")
    findOne(@Body() updateUserDto: UpdateUserDto, @Request() request) {
        return this.userService.findOne(updateUserDto.uuid, request.user)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post("update")
    update(@Body() updateUserDto: UpdateUserDto, @Request() request) {
        return this.userService.update(updateUserDto.uuid, updateUserDto, request.user)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post("delete")
    delete(@Body() updateUserDto: UpdateUserDto, @Request() request) {
        return this.userService.delete(updateUserDto.uuid, request.user)
    }

    // Initial User
    @Post("initial")
    initial() {
        return this.userService.initialUser()
    }

    // Register User
    @Post("register")
    register(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto)
    }
}

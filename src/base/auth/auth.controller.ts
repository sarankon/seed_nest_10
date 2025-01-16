import { Controller, Post, UseGuards, Request, Get, Body, Patch, Delete, Param } from "@nestjs/common"
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger"

import { UserService } from "../user/user.service"
import { AuthService } from "./auth.service"
import { LocalAuthGuard } from "./strategy/local-auth.guard"
import { JwtAuthGuard } from "./strategy/jwt-auth.guard"

import { Roles } from "./role/roles.decorator"
import { Role } from "./role/role.enum"

import { CreateUserDto } from "../user/dto/create-user.dto"
import { UserLoginDto } from "./dto/login-user.dto"
import { OrganizationCreateDto } from "./dto/org-create.dto"
import { RoleCreateDto } from "./dto/role-create.dto"
import { GroupCreateDto } from "./dto/group-create.dto"
import { RoleUpdateDto } from "./dto/role-update.dto"
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
        // console.log("Request: ", request)
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

    // ---------- Manage Roles ----------
    @UseGuards(JwtAuthGuard)
    @Post("role")
    @ApiBearerAuth()
    createRole(@Body() createDto: RoleCreateDto, @Request() request) {
        // console.log('User: ', request.user)
        return this.authService.createRole(createDto, request.user)
    }

    @UseGuards(JwtAuthGuard)
    @Get("role")
    @ApiBearerAuth()
    findAllRole() {
        return this.authService.findAllRole()
    }

    @UseGuards(JwtAuthGuard)
    @Get("role/:id")
    @ApiBearerAuth()
    findOneRole(@Param("id") id: string) {
        return this.authService.findOneRole(parseInt(id))
    }

    @UseGuards(JwtAuthGuard)
    @Patch("role/:id")
    @ApiBearerAuth()
    updateRole(@Param("id") id: string, @Body() updateDto: RoleUpdateDto, @Request() request) {
        return this.authService.updateRole(parseInt(id), updateDto, request.user)
    }

    @UseGuards(JwtAuthGuard)
    @Delete("role/:id")
    @ApiBearerAuth()
    removeRole(@Param("id") id: string, @Request() request) {
        return this.authService.removeRole(parseInt(id), request.user)
    }

    // ---------- Manage Groups ----------
    @UseGuards(JwtAuthGuard)
    @Post("group")
    @ApiBearerAuth()
    createGroup(@Body() createDto: GroupCreateDto, @Request() request) {
        // console.log('User: ', request.user)
        return this.authService.createGroup(createDto, request.user)
    }

    @UseGuards(JwtAuthGuard)
    @Get("group")
    @ApiBearerAuth()
    findAllGroup() {
        return this.authService.findAllGroup()
    }

    @UseGuards(JwtAuthGuard)
    @Get("group/:id")
    @ApiBearerAuth()
    findOneGroup(@Param("id") id: string) {
        return this.authService.findOneGroup(parseInt(id))
    }

    @UseGuards(JwtAuthGuard)
    @Patch("group/:id")
    @ApiBearerAuth()
    updateGroup(@Param("id") id: string, @Body() updateDto: RoleUpdateDto, @Request() request) {
        return this.authService.updateGroup(parseInt(id), updateDto, request.user)
    }

    @UseGuards(JwtAuthGuard)
    @Delete("group/:id")
    @ApiBearerAuth()
    removeGroup(@Param("id") id: string, @Request() request) {
        return this.authService.removeGroup(parseInt(id), request.user)
    }

    // ---------- Manage Organization ----------
    @UseGuards(JwtAuthGuard)
    @Post("organization")
    @ApiBearerAuth()
    createOrg(@Body() createDto: OrganizationCreateDto, @Request() request) {
        // console.log('User: ', request.user)
        return this.authService.createOrg(createDto, request.user)
    }

    @UseGuards(JwtAuthGuard)
    @Get("organization")
    @ApiBearerAuth()
    findAllOrg() {
        return this.authService.findAllOrg()
    }

    @UseGuards(JwtAuthGuard)
    @Get("organization/:id")
    @ApiBearerAuth()
    findOneOrg(@Param("id") id: string) {
        return this.authService.findOneOrg(parseInt(id))
    }

    @UseGuards(JwtAuthGuard)
    @Patch("organization/:id")
    @ApiBearerAuth()
    updateOrg(@Param("id") id: string, @Body() updateDto: RoleUpdateDto, @Request() request) {
        return this.authService.updateOrg(parseInt(id), updateDto, request.user)
    }

    @UseGuards(JwtAuthGuard)
    @Delete("organization/:id")
    @ApiBearerAuth()
    removeOrg(@Param("id") id: string, @Request() request) {
        return this.authService.removeOrg(parseInt(id), request.user)
    }
}

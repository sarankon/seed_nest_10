import { Body, Controller, Injectable, Logger, Post, Request, UseGuards } from "@nestjs/common"
import { ApiBearerAuth } from "@nestjs/swagger"

// Guards
import { JwtAuthGuard } from "src/base/authentication/strategy/jwt-auth.guard"
import { Roles } from "src/base/authentication/role/roles.decorator"
import { Role } from "src/base/authentication/role/role.enum"

// Services
import { RoleService } from "./role.service"

// Data Transfer Objects (DTOs)
import { CreateRoleDto } from "../dto/create-role.dto"
import { UpdateRoleDto } from "../dto/update-role.dto"

@Injectable()
@Controller("role")
export class RoleController {
    // Logger
    // Using Logger to log messages with timestamps
    private readonly logger = new Logger(RoleController.name, { timestamp: true })

    // Constructor
    constructor(private readonly roleService: RoleService) {
        this.logger.log("RoleController initialized")
    }

    // Basic Role Management
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    @Post("create")
    create(@Body() createRoleDto: CreateRoleDto, @Request() request) {
        return this.roleService.create(createRoleDto, request.user)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    @Post("find-all")
    findAll(@Request() request) {
        return this.roleService.findAll()
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    @Post("find")
    findOne(@Body() updateRoleDto: UpdateRoleDto, @Request() request) {
        // return this.roleService.findOne(updateRoleDto.id)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    @Post("update")
    update(@Body() updateRoleDto: UpdateRoleDto, @Request() request) {
        // return this.roleService.update(updateRoleDto.id, updateRoleDto, request.user)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    @Post("delete")
    delete(@Body() updateRoleDto: UpdateRoleDto, @Request() request) {
        // return this.roleService.delete(updateRoleDto.id, request.user)
    }
}

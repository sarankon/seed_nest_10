import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common"
import { ApiBearerAuth } from "@nestjs/swagger"

// Guards
import { JwtAuthGuard } from "src/base/authentication/strategy/jwt-auth.guard"

// Services
import { RoleService } from "./role.service"

// Data Transfer Objects (DTOs)
import { CreateRoleDto } from "../dto/create-role.dto"
import { UpdateRoleDto } from "../dto/update-role.dto"

@Controller("role")
export class RoleController {
    // Constructor
    constructor(private readonly roleService: RoleService) {}

    // Basic Role Management
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post("create")
    create(@Body() createRoleDto: CreateRoleDto, @Request() request) {
        return this.roleService.create(createRoleDto, request.user)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post("find-all")
    findAll(@Request() request) {
        return this.roleService.findAll()
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post("find")
    findOne(@Body() updateRoleDto: UpdateRoleDto, @Request() request) {
        // return this.roleService.findOne(updateRoleDto.id)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post("update")
    update(@Body() updateRoleDto: UpdateRoleDto, @Request() request) {
        // return this.roleService.update(updateRoleDto.id, updateRoleDto, request.user)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post("delete")
    delete(@Body() updateRoleDto: UpdateRoleDto, @Request() request) {
        // return this.roleService.delete(updateRoleDto.id, request.user)
    }
}

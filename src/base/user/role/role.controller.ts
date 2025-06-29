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
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post("create")
    create(@Body() createRoleDto: CreateRoleDto, @Request() request) {
        return this.roleService.create(createRoleDto, request.user)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post("find-all")
    findAll(@Request() request) {
        return this.roleService.findAll()
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post("find")
    findOne(@Body() updateRoleDto: UpdateRoleDto, @Request() request) {
        return this.roleService.findOne(updateRoleDto.id)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post("update")
    update(@Body() updateRoleDto: UpdateRoleDto, @Request() request) {
        return this.roleService.update(updateRoleDto.id, updateRoleDto, request.user)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post("delete")
    delete(@Body() updateRoleDto: UpdateRoleDto, @Request() request) {
        return this.roleService.delete(updateRoleDto.id, request.user)
    }
}

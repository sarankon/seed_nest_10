import { Body, Controller, Injectable, Logger, Post, Request, UseGuards } from "@nestjs/common"
import { ApiBearerAuth } from "@nestjs/swagger"

// Guards
import { JwtAuthGuard } from "src/base/authentication/strategy/jwt-auth.guard"
import { Roles } from "src/base/authentication/role/roles.decorator"
import { Role } from "src/base/authentication/role/role.enum"

// Services
import { GroupService } from "./group.service"

// Data Transfer Objects (DTOs)
import { CreateGroupDto } from "../dto/create-group.dto"
import { UpdateGroupDto } from "../dto/update-group.dto"

@Injectable()
@Controller("group")
export class GroupController {
    // Logger
    // Using Logger to log messages with timestamps
    private readonly logger = new Logger(GroupController.name, { timestamp: true })

    // Constructor
    constructor(private readonly groupService: GroupService) {
        this.logger.log("GroupController initialized")
    }

    // Basic Group Management
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    @Post("create")
    create(@Body() createGroupDto: CreateGroupDto, @Request() request) {
        return this.groupService.create(createGroupDto, request.user)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    @Post("find-all")
    findAll() {
        return this.groupService.findAll()
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    @Post("find")
    findOne(@Body() updateGroupDto: UpdateGroupDto, @Request() request) {
        // return this.groupService.findOne(updateGroupDto.uuid)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    @Post("update")
    update(@Body() updateGroupDto: UpdateGroupDto, @Request() request) {
        // return this.groupService.update(updateGroupDto.id, updateGroupDto, request.user)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    @Post("delete")
    delete(@Body() updateGroupDto: UpdateGroupDto, @Request() request) {
        // return this.groupService.delete(updateGroupDto.id, request.user)
    }
}

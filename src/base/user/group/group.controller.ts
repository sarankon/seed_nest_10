import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common"
import { ApiBearerAuth } from "@nestjs/swagger"

// Guards
import { JwtAuthGuard } from "src/base/authentication/strategy/jwt-auth.guard"

// Services
import { GroupService } from "./group.service"

// Data Transfer Objects (DTOs)
import { CreateGroupDto } from "../dto/create-group.dto"
import { UpdateGroupDto } from "../dto/update-group.dto"

@Controller("group")
export class GroupController {
    // Constructor
    constructor(private readonly groupService: GroupService) {}

    // Basic Group Management
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post("create")
    create(@Body() createGroupDto: CreateGroupDto, @Request() request) {
        return this.groupService.create(createGroupDto, request.user)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post("find-all")
    findAll() {
        return this.groupService.findAll()
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post("find")
    findOne(@Body() updateGroupDto: UpdateGroupDto, @Request() request) {
        return this.groupService.findOne(updateGroupDto.id)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post("update")
    update(@Body() updateGroupDto: UpdateGroupDto, @Request() request) {
        return this.groupService.update(updateGroupDto.id, updateGroupDto, request.user)
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post("delete")
    delete(@Body() updateGroupDto: UpdateGroupDto, @Request() request) {
        return this.groupService.delete(updateGroupDto.id, request.user)
    }
}

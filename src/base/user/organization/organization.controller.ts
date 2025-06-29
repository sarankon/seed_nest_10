import { Body, Controller, Injectable, Logger, Post, Request, UseGuards } from "@nestjs/common"
import { ApiBearerAuth } from "@nestjs/swagger"

// Guards
import { JwtAuthGuard } from "src/base/authentication/strategy/jwt-auth.guard"
import { Roles } from "src/base/authentication/role/roles.decorator"
import { Role } from "src/base/authentication/role/role.enum"

// Services
import { OrganizationService } from "./organization.service"

// Data Transfer Objects (DTOs)
import { CreateOrganizationDto } from "../dto/create-organization.dto"
import { UpdateOrganizationDto } from "../dto/update-organization.dto"

@Injectable()
@Controller("organization")
export class OrganizationController {
    // Logger
    // Using Logger to log messages with timestamps
    private readonly logger = new Logger(OrganizationController.name, { timestamp: true })

    // Constructor
    constructor(private readonly organizationService: OrganizationService) {
        this.logger.log("OrganizationController initialized")
    }

    // Basic Organization Management
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    @Post("create")
    create(@Body() createOrganizationDto: CreateOrganizationDto, @Request() request) {
        return this.organizationService.create(createOrganizationDto, request.user)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    @Post("find-all")
    findAll(@Request() request) {
        return this.organizationService.findAll()
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    @Post("find")
    findOne(@Body() updateOrganizationDto: UpdateOrganizationDto, @Request() request) {
        // return this.organizationService.findOne(updateOrganizationDto.id, request.user)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    @Post("update")
    update(@Body() updateOrganizationDto: UpdateOrganizationDto, @Request() request) {
        // return this.organizationService.update(updateOrganizationDto.id, updateOrganizationDto, request.user)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    @Post("delete")
    delete(@Body() updateOrganizationDto: UpdateOrganizationDto, @Request() request) {
        // return this.organizationService.delete(updateOrganizationDto.id, request.user)
    }
}

import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common"
import { ApiBearerAuth } from "@nestjs/swagger"

// Guards
import { JwtAuthGuard } from "src/base/authentication/strategy/jwt-auth.guard"

// Services
import { OrganizationService } from "./organization.service"

// Data Transfer Objects (DTOs)
import { CreateOrganizationDto } from "../dto/create-organization.dto"
import { UpdateOrganizationDto } from "../dto/update-organization.dto"

@Controller("organization")
export class OrganizationController {
    // Constructor
    constructor(private readonly organizationService: OrganizationService) {}

    // Basic Organization Management
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post("create")
    create(@Body() createOrganizationDto: CreateOrganizationDto, @Request() request) {
        return this.organizationService.create(createOrganizationDto, request.user)
    }

    @Post("find-all")
    findAll(@Request() request) {
        return this.organizationService.findAll()
    }

    @Post("find")
    findOne(@Body() updateOrganizationDto: UpdateOrganizationDto, @Request() request) {
        // return this.organizationService.findOne(updateOrganizationDto.id, request.user)
    }

    @Post("update")
    update(@Body() updateOrganizationDto: UpdateOrganizationDto, @Request() request) {
        // return this.organizationService.update(updateOrganizationDto.id, updateOrganizationDto, request.user)
    }

    @Post("delete")
    delete(@Body() updateOrganizationDto: UpdateOrganizationDto, @Request() request) {
        // return this.organizationService.delete(updateOrganizationDto.id, request.user)
    }
}

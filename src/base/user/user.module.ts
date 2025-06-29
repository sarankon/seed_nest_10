import { Module } from "@nestjs/common"

// User Module
import { UserService } from "./user.service"
import { UserController } from "./user.controller"

// Role Module
import { RoleService } from "./role/role.service"
import { RoleController } from "./role/role.controller"

// Group Module
import { GroupController } from "./group/group.controller"
import { GroupService } from "./group/group.service"

// Organization Module
import { OrganizationService } from "./organization/organization.service"
import { OrganizationController } from "./organization/organization.controller"

@Module({
    imports: [],
    controllers: [UserController, RoleController, GroupController, OrganizationController],
    providers: [UserService, RoleService, GroupService, OrganizationService],
    exports: [],
})
export class UserModule {}

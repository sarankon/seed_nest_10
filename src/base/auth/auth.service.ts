import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import jwtConfig from "../../config/jwt.config"

import { UserService } from "../user/user.service"
import { UserDto } from "./dto/user.dto"
// import { Role } from "./role/role.enum"
import { ResponseBody } from "../response-body"

import { EntityManager } from "@mikro-orm/core"
import { InjectEntityManager } from "@mikro-orm/nestjs"
import { v4 as uuidv4 } from "uuid"

import { BaseRole } from "../user/entities/role.entity"
import { CreateRoleDto } from "../user/dto/create-role.dto"
import { UpdateRoleDto } from "../user/dto/update-role.dto"
import { BaseGroup } from "../user/entities/group.entity"
import { CreateGroupDto } from "../user/dto/create-group.dto"
import { UpdateGroupDto } from "../user/dto/update-group.dto"
import { BaseOrganization } from "../user/entities/organization.entity"
import { CreateOrganizationDto } from "../user/dto/create-organization.dto"
import { UpdateOrganizationDto } from "../user/dto/update-organization.dto"

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @InjectEntityManager("main") private readonly em: EntityManager,
    ) {}

    // Local Strategy (validate) -> validateUser
    async validateUser(username: string, password: string) {
        const user = await this.userService.findByUsername(username)
        if (user) {
            const isMatch = await this.userService.isMatchPassword(password, user.password)
            console.log("isMatch: ", isMatch)

            // If Match -> @Request
            if (isMatch) {
                return user
            } else {
                return null
            }
        } else {
            return null
        }
    }

    // JWT Functionality
    async login(user: UserDto) {
        // console.log('Login: ', user)
        const roles: Array<string> = []

        if (user.roles) {
            for (const role of user.roles) {
                // console.log(role['name'])
                roles.push(role["name"])
            }
        }

        const payload = {
            uuid: user.uuid,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            roles: roles,
        }

        const data = {
            access_token: this.jwtService.sign(payload, {
                expiresIn: jwtConfig.expiresIn,
            }),
            refresh_token: "",
        }
        return new ResponseBody(200, data)
    }

    async logout() {
        // Revoke Access Token and Refresh Token
        return "Logout"
    }

    async isAuthenticated() {
        return new ResponseBody(200, {
            isAuthenticated: true,
        })
    }

    async refreshToken() {
        // Rotate Token
        return "Rotate"
    }

    // Used UserService CreateUser
    // async register() {}

    // Roles
    async createRole(createDto: CreateRoleDto, user: UserDto) {
        try {
            const entity: BaseRole = new BaseRole()
            entity.uuid = uuidv4()
            entity.name = createDto.name
            if (createDto.description) {
                entity.description = createDto.description
            }

            entity.createdBy = user.uuid
            entity.updatedBy = user.uuid

            await this.em.persist(entity).flush()
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new BadRequestException({
                statusCode: 400,
                error: err.sqlMessage,
                message: "",
            })
        }
    }

    async findAllRole() {
        const list = await this.em.findAll(BaseRole)
        console.log(list)
        return new ResponseBody(200, list)
    }

    async findOneRole(id: number) {
        try {
            const entity = await this.em.findOneOrFail(BaseRole, { id: id })
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    async updateRole(id: number, updateEntity: UpdateRoleDto, user: UserDto) {
        try {
            const entity = await this.em.findOneOrFail(BaseRole, { id: id })
            // entity.updatedBy = user.uuid

            this.em.assign(entity, updateEntity, { mergeObjectProperties: true })
            await this.em.flush()
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            if (err.sqlMessage) {
                throw new BadRequestException({
                    statusCode: 400,
                    error: err.sqlMessage,
                    message: "",
                })
            } else {
                throw new NotFoundException(`Data #id:${id} Not Found`)
            }
        }
    }

    async removeRole(id: number, user: UserDto) {
        try {
            const entity = await this.em.findOneOrFail(BaseRole, { id: id })
            // entity.updatedBy = user.uuid

            this.em.remove(entity)
            await this.em.flush()
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    // Groups
    async createGroup(createDto: CreateGroupDto, user: UserDto) {
        try {
            const entity: BaseGroup = new BaseGroup()
            entity.uuid = uuidv4()
            entity.name = createDto.name
            if (createDto.description) {
                entity.description = createDto.description
            }

            entity.createdBy = user.uuid
            entity.updatedBy = user.uuid

            await this.em.persist(entity).flush()
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new BadRequestException({
                statusCode: 400,
                error: err.sqlMessage,
                message: "",
            })
        }
    }

    async findAllGroup() {
        const list = await this.em.findAll(BaseGroup)
        console.log(list)
        return new ResponseBody(200, list)
    }

    async findOneGroup(id: number) {
        try {
            const entity = await this.em.findOneOrFail(BaseGroup, { id: id })
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    async updateGroup(id: number, updateEntity: UpdateGroupDto, user: UserDto) {
        try {
            const entity = await this.em.findOneOrFail(BaseGroup, { id: id })
            this.em.assign(entity, updateEntity, { mergeObjectProperties: true })
            await this.em.flush()
            return new ResponseBody(200, entity)
        } catch (err) {
            if (err.sqlMessage) {
                throw new BadRequestException({
                    statusCode: 400,
                    error: err.sqlMessage,
                    message: "",
                })
            } else {
                throw new NotFoundException(`Data #id:${id} Not Found`)
            }
        }
    }

    async removeGroup(id: number, user: UserDto) {
        try {
            const entity = await this.em.findOneOrFail(BaseGroup, { id: id })
            // entity.updatedBy = user.uuid

            this.em.remove(entity)
            await this.em.flush()
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    // Organization
    async createOrg(createDto: CreateOrganizationDto, user: UserDto) {
        try {
            const entity: BaseOrganization = new BaseOrganization()
            entity.uuid = uuidv4()
            entity.name = createDto.name
            if (createDto.description) {
                entity.description = createDto.description
            }

            entity.createdBy = user.uuid
            entity.updatedBy = user.uuid

            await this.em.persist(entity).flush()
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new BadRequestException({
                statusCode: 400,
                error: err.sqlMessage,
                message: "",
            })
        }
    }

    async findAllOrg() {
        const list = await this.em.findAll(BaseOrganization)
        console.log(list)
        return new ResponseBody(200, list)
    }

    async findOneOrg(id: number) {
        try {
            const entity = await this.em.findOneOrFail(BaseOrganization, { id: id })
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    async updateOrg(id: number, updateEntity: UpdateOrganizationDto, user: UserDto) {
        try {
            const entity = await this.em.findOneOrFail(BaseOrganization, { id: id })
            // entity.updatedBy = user.uuid

            this.em.assign(entity, updateEntity, { mergeObjectProperties: true })
            await this.em.flush()
            return new ResponseBody(200, entity)
        } catch (err) {
            if (err.sqlMessage) {
                throw new BadRequestException({
                    statusCode: 400,
                    error: err.sqlMessage,
                    message: "",
                })
            } else {
                throw new NotFoundException(`Data #id:${id} Not Found`)
            }
        }
    }

    async removeOrg(id: number, user: UserDto) {
        try {
            const entity = await this.em.findOneOrFail(BaseOrganization, { id: id })
            this.em.remove(entity)
            // entity.updatedBy = user.uuid

            await this.em.flush()
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }
}

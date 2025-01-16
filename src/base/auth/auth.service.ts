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

import { _Role } from "./entity/role.entity"
import { RoleCreateDto } from "./dto/role-create.dto"
import { RoleUpdateDto } from "./dto/role-update.dto"
import { _Group } from "./entity/group.entity"
import { GroupCreateDto } from "./dto/group-create.dto"
import { GroupUpdateDto } from "./dto/group-update.dto"
import { _Organization } from "./entity/organization.entity"
import { OrganizationCreateDto } from "./dto/org-create.dto"
import { OrganizationUpdateDto } from "./dto/org-update.dto"

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
    async createRole(createDto: RoleCreateDto, user: UserDto) {
        try {
            const entity: _Role = new _Role()
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
        const list = await this.em.findAll(_Role)
        console.log(list)
        return new ResponseBody(200, list)
    }

    async findOneRole(id: number) {
        try {
            const entity = await this.em.findOneOrFail(_Role, { id: id })
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    async updateRole(id: number, updateEntity: RoleUpdateDto, user: UserDto) {
        try {
            const entity = await this.em.findOneOrFail(_Role, { id: id })
            entity.updatedBy = user.uuid

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
            const entity = await this.em.findOneOrFail(_Role, { id: id })
            entity.updatedBy = user.uuid

            this.em.remove(entity)
            await this.em.flush()
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    // Groups
    async createGroup(createDto: GroupCreateDto, user: UserDto) {
        try {
            const entity: _Group = new _Group()
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
        const list = await this.em.findAll(_Group)
        console.log(list)
        return new ResponseBody(200, list)
    }

    async findOneGroup(id: number) {
        try {
            const entity = await this.em.findOneOrFail(_Group, { id: id })
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    async updateGroup(id: number, updateEntity: GroupUpdateDto, user: UserDto) {
        try {
            const entity = await this.em.findOneOrFail(_Group, { id: id })
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
            const entity = await this.em.findOneOrFail(_Group, { id: id })
            entity.updatedBy = user.uuid

            this.em.remove(entity)
            await this.em.flush()
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    // Organization
    async createOrg(createDto: OrganizationCreateDto, user: UserDto) {
        try {
            const entity: _Organization = new _Organization()
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
        const list = await this.em.findAll(_Organization)
        console.log(list)
        return new ResponseBody(200, list)
    }

    async findOneOrg(id: number) {
        try {
            const entity = await this.em.findOneOrFail(_Organization, { id: id })
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    async updateOrg(id: number, updateEntity: OrganizationUpdateDto, user: UserDto) {
        try {
            const entity = await this.em.findOneOrFail(_Organization, { id: id })
            entity.updatedBy = user.uuid
            
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
            const entity = await this.em.findOneOrFail(_Organization, { id: id })
            this.em.remove(entity)
            entity.updatedBy = user.uuid

            await this.em.flush()
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }
}

import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import jwtConfig from "../../config/jwt.config"

import { UserService } from "../user/user.service"
import { UserDto } from "./dto/user.dto"
import { Role } from "./role/role.enum"
import { ResponseBody } from "../response-body"

import { EntityManager } from "@mikro-orm/core"
import { InjectEntityManager } from "@mikro-orm/nestjs"
import { v4 as uuidv4 } from "uuid"
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
        const payload = {
            uuid: user.uuid,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            roles: [Role.User],
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

    async createOrg(createDto: OrganizationCreateDto) {
        try {
            const entity: _Organization = new _Organization()
            entity.uuid = uuidv4()
            entity.name = createDto.name
            if (createDto.description) {
                entity.description = createDto.description
            }
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

    async updateOrg(id: number, updateEntity: OrganizationUpdateDto) {
        try {
            const entity = await this.em.findOneOrFail(_Organization, { id: id })
            this.em.assign(entity, updateEntity, { mergeObjectProperties: true })
            await this.em.flush()
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    async removeOrg(id: number) {
        try {
            const entity = await this.em.findOneOrFail(_Organization, { id: id })
            this.em.remove(entity)
            await this.em.flush()
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }
}

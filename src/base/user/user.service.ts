import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { EntityManager, MikroORM } from "@mikro-orm/core"
import { InjectEntityManager, InjectMikroORM } from "@mikro-orm/nestjs"

import { v7 as uuidv7 } from "uuid"
import * as bcrypt from "bcrypt"

// Entities
import { BaseUser } from "./entities/user.entity"
import { BaseRole } from "./entities/role.entity"
import { BaseGroup } from "./entities/group.entity"
import { BaseOrganization } from "./entities/organization.entity"

// Data Transfer Objects (DTOs)
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { ResponseBody } from "../response-body"

@Injectable()
export class UserService {
    constructor(
        @InjectMikroORM("postgreSql") private readonly mikroOrm: MikroORM,
        @InjectEntityManager("postgreSql") private readonly entityManager: EntityManager,
    ) {}

    // Hash Password and Check Password
    async hashPassword(password) {
        const saltOrRounds = 10
        const hash = await bcrypt.hash(password, saltOrRounds)
        return hash
    }

    async isMatchPassword(password, hash) {
        const isMatch = await bcrypt.compare(password, hash)
        return isMatch
    }

    // Basic Service
    async create(createDto: CreateUserDto) {
        let hashPassword: string = ""
        await this.hashPassword(createDto.password).then((hash) => {
            hashPassword = hash
        })

        try {
            const entity: BaseUser = new BaseUser()
            entity.uuid = uuidv7()
            entity.username = createDto.username
            entity.password = hashPassword
            entity.firstName = createDto.firstName
            entity.lastName = createDto.lastName
            entity.email = createDto.email
            entity.phone = createDto.phone
            await this.entityManager.persist(entity).flush()

            entity.password = "<hidden>"
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new BadRequestException({
                status: 400,
                message: "",
                error: err.sqlMessage,
            })
        }
    }

    async findAll() {
        const list = await this.entityManager.findAll(BaseUser, { populate: ["organization", "roles", "groups"] })
        list.forEach((data) => {
            data.password = "<hidden>"
        })
        console.log(list)
        return new ResponseBody(200, list)
    }

    async findOne(uuid: string) {
        try {
            const entity = await this.entityManager.findOneOrFail(BaseUser, { uuid: uuid })
            entity.password = "<hidden>"
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #uuid: ${uuid} Not Found`)
        }
    }

    async update(uuid: string, updateDto: UpdateUserDto) {
        try {
            const entity = await this.entityManager.findOneOrFail(BaseUser, { uuid: uuid })

            if (updateDto.password != "") {
                const hashPassword = await this.hashPassword(updateDto.password)
                updateDto.password = hashPassword
            }

            // this.entityManager.assign(entity, updateDto, { mergeObjectProperties: true })
            await this.entityManager.flush()
            entity.password = "<hidden>"
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #uuid: ${uuid} Not Found`)
        }
    }

    async delete(uuid: string) {
        try {
            const entity = await this.entityManager.findOneOrFail(BaseUser, { uuid: uuid })

            // Soft Delete
            // entity.deletedBy = "User Service"
            entity.deletedDate = new Date()

            // Hard Delete
            // this.entityManager.remove(entity)

            await this.entityManager.flush()
            entity.password = "<hidden>"
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #uuid: ${uuid} Not Found`)
        }
    }

    // For Authentication Service
    async findByUsername(username: string) {
        try {
            const entity = await this.entityManager.findOneOrFail(BaseUser, { username: username }, { populate: ["organization", "roles", "groups"] })
            return entity
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #username: ${username} Not Found`)
        }
    }

    // For Initial User
    async initialUser() {
        console.log("Initial User ...")

        // Create Default Organization
        const userOrganization = new BaseOrganization()
        userOrganization.uuid = uuidv7()
        userOrganization.name = "Default Organization"
        userOrganization.description = "Default Organization Description"
        this.entityManager.persist(userOrganization)
        await this.entityManager.flush()

        // Create Default Group
        const userGroup = new BaseGroup()
        userGroup.uuid = uuidv7()
        userGroup.name = "Default Group"
        userGroup.description = "Default Group Description"
        this.entityManager.persist(userGroup)
        await this.entityManager.flush()

        // Create Role User
        const userRole = new BaseRole()
        userRole.uuid = uuidv7()
        userRole.name = "user"
        userRole.description = "Role User"
        this.entityManager.persist(userRole)
        await this.entityManager.flush()

        // Create Role Admin
        const adminRole = new BaseRole()
        adminRole.uuid = uuidv7()
        adminRole.name = "admin"
        adminRole.description = "Role Admin"
        this.entityManager.persist(adminRole)
        await this.entityManager.flush()

        // Create User
        const userEntity = new BaseUser()
        userEntity.uuid = uuidv7()
        userEntity.username = "user"
        userEntity.password = await this.hashPassword("user")
        userEntity.firstName = "User"
        userEntity.lastName = "Default"
        userEntity.email = "user@default.com"

        userEntity.organization = userOrganization
        userEntity.groups.add(userGroup)
        userEntity.roles.add(userRole)
        this.entityManager.persist(userEntity)
        await this.entityManager.flush()

        // Create Admin
        const adminEntity = new BaseUser()
        adminEntity.uuid = uuidv7()
        adminEntity.username = "admin"
        adminEntity.password = await this.hashPassword("admin")
        adminEntity.firstName = "Admin"
        adminEntity.lastName = "Default"
        adminEntity.email = "admin@default.com"

        adminEntity.organization = userOrganization
        adminEntity.groups.add(userGroup)
        adminEntity.roles.add(adminRole)
        this.entityManager.persist(adminEntity)
        await this.entityManager.flush()

        console.log("Initial User Successful :)")
        return new ResponseBody(200, {
            user: userEntity,
            admin: adminEntity,
        })
    }
}

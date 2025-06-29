import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from "@nestjs/common"
import { EntityManager, MikroORM } from "@mikro-orm/core"
import { InjectEntityManager, InjectMikroORM } from "@mikro-orm/nestjs"

// UUID
import { v7 as uuidv7 } from "uuid"

// Bcrypt for Password Hashing
import * as bcrypt from "bcrypt"

// Entities
import { BaseUser } from "src/base/user/entities/user.entity"
import { BaseRole } from "src/base/user/entities/role.entity"
import { BaseGroup } from "src/base/user/entities/group.entity"
import { BaseOrganization } from "src/base/user/entities/organization.entity"

// Enum for Roles
import { Role } from "src/base/authentication/role/role.enum"

// Data Transfer Objects (DTOs)
import { UserDto } from "src/base/authentication/dto/user.dto"
import { CreateUserDto } from "src/base/user/dto/create-user.dto"
import { UpdateUserDto } from "src/base/user/dto/update-user.dto"
import { ResponseBody } from "src/base/response-body"

@Injectable()
export class UserService {
    // Logger
    // Using Logger to log messages with timestamps
    private readonly logger = new Logger(UserService.name, { timestamp: true })

    // Constructor
    // Inject MikroORM and EntityManager for database operations
    // This allows us to interact with the database using MikroORM
    constructor(
        @InjectMikroORM("postgreSql") private readonly mikroOrm: MikroORM,
        @InjectEntityManager("postgreSql") private readonly entityManager: EntityManager,
    ) {}

    // Hash Password
    // This method hashes the password using bcrypt with a salt or rounds of 10
    // It returns the hashed password
    async hashPassword(password) {
        const saltOrRounds = 10
        const hash = await bcrypt.hash(password, saltOrRounds)
        return hash
    }

    // Check Password Match
    // This method checks if the provided password matches the hashed password
    // It uses bcrypt's compare function to verify the password
    async isMatchPassword(password, hash) {
        const isMatch = await bcrypt.compare(password, hash)
        return isMatch
    }

    // Validate Username and Password
    async validateUser(username: string, password: string) {
        // Find User by Username
        // If User Found, Check Password
        const user = await this.entityManager.findOne(BaseUser, { username: username }, { populate: ["organization", "roles", "groups"] })

        // If User Not Found, Return Null
        if (user) {
            // Check Password
            // If Password Match, Return User
            const isMatch = await this.isMatchPassword(password, user.password)
            if (isMatch) {
                return user
            } else {
                return null
            }
        } else {
            return null
        }
    }

    // Basic Service
    async create(createDto: CreateUserDto, userDto?: UserDto) {
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

            if (userDto) {
                entity.createdBy = userDto.uuid
                entity.updatedBy = userDto.uuid

                const userCreator = await this.entityManager.findOne(BaseUser, { uuid: userDto.uuid }, { populate: ["organization", "roles", "groups"] })
                entity.organization = userCreator.organization
            }

            await this.entityManager.persist(entity).flush()

            entity.password = "<hidden>"
            return new ResponseBody(200, entity)
        } catch (err) {
            this.logger.error("Error:", err)

            // If Error, Throw BadRequestException
            throw new BadRequestException({
                status: 400,
                message: "Error Creating User",
                error: err.detail,
            })
        }
    }

    async findAll(userDto: UserDto) {
        try {
            const user = await this.entityManager.findOne(BaseUser, { uuid: userDto.uuid }, { populate: ["organization", "roles", "groups"] })
            const list = await this.entityManager.find(BaseUser, { organization: user.organization }, { populate: ["organization", "roles", "groups"] })

            list.forEach((data) => {
                data.password = "<hidden>"
            })
            return new ResponseBody(200, list)
        } catch (err) {
            this.logger.error("Error:", err)

            // If Error, Throw BadRequestException
            throw new BadRequestException({
                status: 400,
                message: "Error Finding Users",
                error: err.detail,
            })
        }
    }

    async findOne(uuid: string, userDto?: UserDto) {
        try {
            const user = await this.entityManager.findOne(BaseUser, { uuid: userDto.uuid }, { populate: ["organization", "roles", "groups"] })
            const entity = await this.entityManager.findOneOrFail(BaseUser, { uuid: uuid, organization: user.organization }, { populate: ["organization", "roles", "groups"] })

            entity.password = "<hidden>"
            return new ResponseBody(200, entity)
        } catch (err) {
            this.logger.error("Error:", err)

            // If Error is Not Found, Throw NotFoundException
            throw new NotFoundException(`Key (uuid)=(${uuid}) Not Found`)
        }
    }

    async update(uuid: string, updateDto: UpdateUserDto, userDto: UserDto) {
        try {
            const user = await this.entityManager.findOne(BaseUser, { uuid: userDto.uuid }, { populate: ["organization", "roles", "groups"] })
            const entity = await this.entityManager.findOneOrFail(BaseUser, { uuid: uuid, organization: user.organization }, { populate: ["organization", "roles", "groups"] })

            if (user.uuid !== entity.uuid && !user.roles.toArray().some((role) => role.name === Role.Admin)) {
                throw new ForbiddenException(`You do not have permission to update this user`)
            }

            if (updateDto.password != "") {
                const hashPassword = await this.hashPassword(updateDto.password)
                updateDto.password = hashPassword
            }

            this.entityManager.assign(entity, updateDto, { mergeObjectProperties: true })
            entity.updatedBy = user.uuid
            await this.entityManager.flush()

            entity.password = "<hidden>"
            return new ResponseBody(200, entity)
        } catch (err) {
            this.logger.error("Error:", err)

            // If Error is Not Found, Throw NotFoundException
            throw new NotFoundException(`Key (uuid)=(${uuid}) Not Found`)
        }
    }

    async delete(uuid: string, userDto: UserDto) {
        try {
            const user = await this.entityManager.findOne(BaseUser, { uuid: userDto.uuid }, { populate: ["organization", "roles", "groups"] })
            const entity = await this.entityManager.findOneOrFail(BaseUser, { uuid: uuid, organization: user.organization })

            // Soft Delete
            entity.updatedBy = user.uuid
            entity.deletedBy = user.uuid
            entity.deletedDate = new Date()

            // Hard Delete
            // this.entityManager.remove(entity)

            await this.entityManager.flush()

            entity.password = "<hidden>"
            return new ResponseBody(200, entity)
        } catch (err) {
            this.logger.error("Error:", err)

            // If Error is Not Found, Throw NotFoundException
            throw new NotFoundException(`Key (uuid)=(${uuid}) Not Found`)
        }
    }

    // For Authentication Service
    async findByUsername(username: string) {
        try {
            const user = await this.entityManager.findOneOrFail(BaseUser, { username: username }, { populate: ["organization", "roles", "groups"] })
            return user
        } catch (err) {
            this.logger.error("Error:", err)

            // If Error is Not Found, Throw NotFoundException
            throw new NotFoundException(`Key (username)=(${username}) Not Found`)
        }
    }

    // For Initial User
    async initialUser() {
        // Initial User
        this.logger.log("Initializing Default User ...")

        try {
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
            adminEntity.roles.add(userRole)
            adminEntity.roles.add(adminRole)
            this.entityManager.persist(adminEntity)
            await this.entityManager.flush()

            this.logger.log("Initial User Successful :)")
            return new ResponseBody(200, {
                user: userEntity,
                admin: adminEntity,
            })
        } catch (err) {
            this.logger.error("Error:", err)

            // If Error, Throw BadRequestException
            throw new BadRequestException({
                status: 400,
                message: "Error Initializing Default User",
                error: err.detail,
            })
        }
    }
}

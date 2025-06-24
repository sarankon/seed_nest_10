import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { EntityManager, UuidType } from "@mikro-orm/core"
import { InjectEntityManager } from "@mikro-orm/nestjs"

import { BaseUser } from "../../user/entities/user.entity"

// Basic Service
import { CreateUserDto } from "src/base/user/dto/create-user.dto"
import { UpdateUserDto } from "src/base/user/dto/update-user.dto"
import { ResponseBody } from "src/base/response-body"

// import { UserLoginDto } from "../auth/dto/login-user.dto"
import { v4 as uuidv4 } from "uuid"
import * as bcrypt from "bcrypt"

@Injectable()
export class UserService {
    constructor(@InjectEntityManager("main") private readonly em: EntityManager) {}

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
            entity.uuid = uuidv4()
            entity.username = createDto.username
            entity.password = hashPassword
            entity.firstName = createDto.firstName
            entity.lastName = createDto.lastName
            entity.email = createDto.email
            entity.phone = createDto.phone
            await this.em.persist(entity).flush()

            entity.password = "<hidden>"
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

    async findAll() {
        const list = await this.em.findAll(BaseUser)
        list.forEach((data) => {
            data.password = "<hidden>"
        })
        console.log(list)
        return new ResponseBody(200, list)
    }

    async findOne(id: number) {
        try {
            const entity = await this.em.findOneOrFail(BaseUser, { id: id })
            entity.password = "<hidden>"
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    async update(id: number, updateDto: UpdateUserDto) {
        try {
            const entity = await this.em.findOneOrFail(BaseUser, { id: id })

            if (updateDto.password != "") {
                const hashPassword = await this.hashPassword(updateDto.password)
                updateDto.password = hashPassword
            }

            // this.em.assign(entity, updateDto, { mergeObjectProperties: true })
            await this.em.flush()
            entity.password = "<hidden>"
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    async remove(id: number) {
        try {
            const entity = await this.em.findOneOrFail(BaseUser, { id: id })
            this.em.remove(entity)
            await this.em.flush()
            entity.password = "<hidden>"
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    // Authen Service
    async findByUsername(username: string) {
        try {
            const entity = await this.em.findOneOrFail(BaseUser, { username: username }, { populate: ["organization", "roles", "groups"] })
            return entity
        } catch (err) {
            console.error("Error:", err)
            return null
        }
    }
}

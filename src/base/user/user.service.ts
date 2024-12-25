import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { EntityManager, UuidType } from "@mikro-orm/core"
import { InjectEntityManager } from "@mikro-orm/nestjs"

import { _User } from "./entities/user.entity"

// Basic Service
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { ResponseBody } from "../response-body"

import { UserLoginDto } from "../auth/dto/login-user.dto"
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
    async create(createUserDto: CreateUserDto) {
        let hashPassword: string = ""
        await this.hashPassword(createUserDto.password).then((hash) => {
            hashPassword = hash
        })

        try {
            const entity: _User = new _User()
            entity.uuid = uuidv4()
            entity.username = createUserDto.username
            entity.password = hashPassword
            entity.firstName = createUserDto.firstName
            entity.lastName = createUserDto.lastName
            entity.email = createUserDto.email
            entity.phone = createUserDto.phone
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
        const list = await this.em.findAll(_User)
        list.forEach((data)=> {
            data.password = "<hidden>"
        })
        console.log(list)
        return new ResponseBody(200, list)
    }

    async findOne(id: number) {
        try {
            const entity = await this.em.findOneOrFail(_User, { id: id })
            entity.password = "<hidden>"
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    async update(id: number, updateEntity: UpdateUserDto) {
        try {
            const entity = await this.em.findOneOrFail(_User, { id: id })

            if(updateEntity.password != "") {
                const hashPassword = await this.hashPassword(updateEntity.password)
                updateEntity.password = hashPassword
            }

            this.em.assign(entity, updateEntity, { mergeObjectProperties: true })
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
            const entity = await this.em.findOneOrFail(_User, { id: id })
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
            const entity = await this.em.findOneOrFail(_User, { username: username })
            return entity
        } catch (err) {
            console.error("Error:", err)
            return null
        }
    }
}

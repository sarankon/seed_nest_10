import { Injectable, NotFoundException } from "@nestjs/common"
import { EntityManager } from "@mikro-orm/core"
import { InjectEntityManager } from "@mikro-orm/nestjs"

import { User } from "./entities/user.entity"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { ResponseBody } from "../response-body"

@Injectable()
export class UserService {
    constructor(@InjectEntityManager("main") private readonly em: EntityManager) {}

    async create(createUserDto: CreateUserDto) {
        const entity: User = new User()
        entity.username = createUserDto.username
        entity.password = createUserDto.password
        entity.firstName = createUserDto.firstName
        entity.lastName = createUserDto.lastName
        entity.email = createUserDto.email
        entity.phone = createUserDto.phone
        await this.em.persist(entity).flush()
        return new ResponseBody(200, entity)
    }

    async findAll() {
        const list = await this.em.findAll(User)
        console.log(list)
        return new ResponseBody(200, list)
    }

    async findOne(id: number) {
        try {
            const entity = await this.em.findOneOrFail(User, id)
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error(err.name)
            console.error(err.message)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    async update(id: number, updateEntity: UpdateUserDto) {
        try {
            const entity = await this.em.findOneOrFail(User, id)
            this.em.assign(entity, updateEntity, { mergeObjectProperties: true })
            await this.em.flush()
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error(err.name)
            console.error(err.message)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    async remove(id: number) {
        try {
            const entity = await this.em.findOneOrFail(User, id)
            this.em.remove(entity)
            await this.em.flush()
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error(err.name)
            console.error(err.message)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }
}

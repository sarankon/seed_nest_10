import { Injectable, NotFoundException } from "@nestjs/common"
import { CreateCrudDto } from "./dto/create-crud.dto"
import { UpdateCrudDto } from "./dto/update-crud.dto"

import { EntityManager } from "@mikro-orm/core"
import { Crud } from "./entities/crud.entity"
import { ResponseBody } from "src/base/response/response-body"
import { InjectEntityManager } from "@mikro-orm/nestjs"

@Injectable()
export class CrudService {
    constructor(
        // private readonly em: EntityManager
        @InjectEntityManager("main") private readonly em: EntityManager
    ) {}

    async create(createEntity: CreateCrudDto) {
        const entity: Crud = new Crud()
        entity.topic = createEntity.topic
        entity.detail = createEntity.detail
        await this.em.persist(entity).flush()
        return new ResponseBody(200, entity)
    }

    async findAll() {
        const list = await this.em.findAll(Crud)
        console.log(list)
        return new ResponseBody(200, list)
    }

    async findOne(id: number) {
        try {
            const entity = await this.em.findOneOrFail(Crud, id)
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error(err.name)
            console.error(err.message)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    async update(id: number, updateEntity: UpdateCrudDto) {
        try {
            const entity = await this.em.findOneOrFail(Crud, id)
            this.em.assign(entity, updateEntity, {mergeObjectProperties: true})
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
            const entity = await this.em.findOneOrFail(Crud, id)
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

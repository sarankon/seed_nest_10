import { Injectable, NotFoundException } from "@nestjs/common"
import { CreateCrudDto } from "./dto/create-crud.dto"
import { UpdateCrudDto } from "./dto/update-crud.dto"

import { EntityManager, wrap } from "@mikro-orm/core"
import { Crud } from "./entities/crud.entity"
import { ResponseBody } from "src/base/dto/response-body.dto"

@Injectable()
export class CrudService {
    constructor(private readonly em: EntityManager) {}

    async create(createCrudDto: CreateCrudDto) {
        const crud: Crud = new Crud()
        crud.topic = createCrudDto.topic
        crud.detail = createCrudDto.detail
        await this.em.persist(crud).flush()
        return new ResponseBody(200, crud)
    }

    async findAll() {
        const list = await this.em.findAll(Crud)
        console.log(list)
        return new ResponseBody(200, list)
    }

    async findOne(id: number) {
        try {
            const crud = await this.em.findOneOrFail(Crud, id)
            return new ResponseBody(200, crud)
        } catch (err) {
            console.error(err.name)
            console.error(err.message)
            throw new NotFoundException(`Crud #id:${id} Not Found`)
        }
    }

    async update(id: number, updateCrudDto: UpdateCrudDto) {
        try {
            const crud = await this.em.findOneOrFail(Crud, id)
            wrap(crud).assign({
                topic: updateCrudDto.topic,
                detail: updateCrudDto.detail,
            })
            await this.em.flush()
            return new ResponseBody(200, crud)
        } catch (err) {
            console.error(err.name)
            console.error(err.message)
            throw new NotFoundException(`Crud #id:${id} Not Found`)
        }
    }

    async remove(id: number) {
        try {
            const crud = await this.em.findOneOrFail(Crud, id)
            this.em.remove(crud)
            await this.em.flush()
            return new ResponseBody(200, crud)
        } catch (err) {
            console.error(err.name)
            console.error(err.message)
            throw new NotFoundException(`Crud #id:${id} Not Found`)
        }
    }
}

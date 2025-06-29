import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { EntityManager, MikroORM } from "@mikro-orm/core"
import { InjectEntityManager, InjectMikroORM } from "@mikro-orm/nestjs"

import { v7 as uuidv7 } from "uuid"

// Entities
import { BaseOrganization } from "../entities/organization.entity"

// Data Transfer Objects (DTOs)
import { CreateOrganizationDto } from "../dto/create-organization.dto"
import { UpdateOrganizationDto } from "../dto/update-organization.dto"
import { UserDto } from "src/base/authentication/dto/user.dto"
import { ResponseBody } from "src/base/response-body"

@Injectable()
export class OrganizationService {
    // Constructor
    constructor(
        @InjectMikroORM("postgreSql") private readonly mikroOrm: MikroORM,
        @InjectEntityManager("postgreSql") private readonly entityManager: EntityManager,
    ) {}

    // Organization
    async create(createDto: CreateOrganizationDto, user: UserDto) {
        try {
            const entity: BaseOrganization = new BaseOrganization()
            entity.uuid = uuidv7()
            entity.name = createDto.name
            if (createDto.description) {
                entity.description = createDto.description
            }

            entity.createdBy = user.uuid
            entity.updatedBy = user.uuid

            await this.entityManager.persist(entity).flush()
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
        const list = await this.entityManager.findAll(BaseOrganization)
        console.log(list)
        return new ResponseBody(200, list)
    }

    async findOne(id: number, user: UserDto) {
        try {
            const entity = await this.entityManager.findOneOrFail(BaseOrganization, { id: id })
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    async update(id: number, updateEntity: UpdateOrganizationDto, user: UserDto) {
        try {
            const entity = await this.entityManager.findOneOrFail(BaseOrganization, { id: id })
            // entity.updatedBy = user.uuid

            this.entityManager.assign(entity, updateEntity, { mergeObjectProperties: true })
            await this.entityManager.flush()
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

    async remove(id: number, user: UserDto) {
        try {
            const entity = await this.entityManager.findOneOrFail(BaseOrganization, { id: id })
            this.entityManager.remove(entity)
            // entity.updatedBy = user.uuid

            await this.entityManager.flush()
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }
}

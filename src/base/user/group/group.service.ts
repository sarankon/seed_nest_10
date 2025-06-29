import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common"
import { EntityManager, MikroORM } from "@mikro-orm/core"
import { InjectEntityManager, InjectMikroORM } from "@mikro-orm/nestjs"

// UUID
// Using UUID v7 for unique identifiers
import { v7 as uuidv7 } from "uuid"

// Entities
import { BaseGroup } from "../entities/group.entity"

// Data Transfer Objects (DTOs)
import { CreateGroupDto } from "../dto/create-group.dto"
import { UpdateGroupDto } from "../dto/update-group.dto"
import { UserDto } from "src/base/authentication/dto/user.dto"
import { ResponseBody } from "src/base/response-body"

@Injectable()
export class GroupService {
    // Logger
    // Using Logger to log messages with timestamps
    private readonly logger = new Logger(GroupService.name, { timestamp: true })

    // Constructor
    constructor(
        @InjectMikroORM("postgreSql") private readonly mikroOrm: MikroORM,
        @InjectEntityManager("postgreSql") private readonly entityManager: EntityManager,
    ) {}

    // Basic Service
    async create(createDto: CreateGroupDto, user: UserDto) {
        try {
            const entity: BaseGroup = new BaseGroup()
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
        const list = await this.entityManager.findAll(BaseGroup)
        console.log(list)
        return new ResponseBody(200, list)
    }

    async findOne(id: number) {
        try {
            const entity = await this.entityManager.findOneOrFail(BaseGroup, { id: id })
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    async update(id: number, updateEntity: UpdateGroupDto, user: UserDto) {
        try {
            const entity = await this.entityManager.findOneOrFail(BaseGroup, { id: id })
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

    async delete(id: number, user: UserDto) {
        try {
            const entity = await this.entityManager.findOneOrFail(BaseGroup, { id: id })
            // entity.updatedBy = user.uuid

            this.entityManager.remove(entity)
            await this.entityManager.flush()
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error("Error:", err)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }
}

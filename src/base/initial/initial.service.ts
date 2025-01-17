import { Injectable } from "@nestjs/common"
import { EntityManager, MikroORM } from "@mikro-orm/core"
import { InjectEntityManager, InjectMikroORM } from "@mikro-orm/nestjs"

import { v4 as uuidv4 } from "uuid"
import * as bcrypt from "bcrypt"

import { _Role } from "../auth/entity/role.entity"
import { _User } from "../user/entities/user.entity"
import { UserService } from "../user/user.service"

@Injectable()
export class InitialService {
    constructor(
        // For Multiple Database
        @InjectMikroORM("main") private readonly ormMain: MikroORM,
        @InjectEntityManager("main") private readonly emMain: EntityManager,
        private readonly userService: UserService
    ) {}

    async initialDatabase() {
        console.info("Initial Database ...")

        // For Multiple Database
        await this.ormMain.schema.dropSchema()
        await this.ormMain.schema.updateSchema()

        console.info("Create Roles")
        const roleEntity = new _Role()
        roleEntity.uuid = uuidv4()
        roleEntity.name = "admin"
        roleEntity.description = "Role Admin"
        this.emMain.persist(roleEntity)
        await this.emMain.flush()

        console.info("Create Admin")
        
        let hashPassword: string = ""
        await this.userService.hashPassword("admin").then((hash) => {
            hashPassword = hash
        })

        const userEntity = new _User()
        userEntity.uuid = uuidv4()
        userEntity.username = "admin"
        userEntity.password = hashPassword
        userEntity.email = "admin@mail.co"
        userEntity.roles.add(roleEntity)
        this.emMain.persist(userEntity)
        await this.emMain.flush()

        console.info("Initial Database Successful :)")
    }

    async updateSchema() {
        console.info("Update Database Schema ...")
        await this.ormMain.schema.updateSchema()
        console.info("Update Database Schema Successful :)")
    }
}

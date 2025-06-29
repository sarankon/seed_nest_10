import { Injectable } from "@nestjs/common"
import { EntityManager, MikroORM } from "@mikro-orm/core"
import { InjectEntityManager, InjectMikroORM } from "@mikro-orm/nestjs"

@Injectable()
export class DatabaseService {
    constructor(
        // For Multiple Database
        @InjectMikroORM("postgreSql") private readonly mikroOrm: MikroORM,
        @InjectEntityManager("postgreSql") private readonly entityManager: EntityManager,
    ) {
        // Development
        this.initialDatabase()
    }

    async initialDatabase() {
        console.info("Initial Database ...")

        // For Multiple Database
        // await this.mikroOrm.schema.dropSchema()
        // await this.mikroOrm.schema.createSchema()
        await this.mikroOrm.schema.updateSchema({ safe: true })

        console.info("Initial Database Successful :)")
    }
}

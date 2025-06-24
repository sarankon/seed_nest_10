import { Injectable } from "@nestjs/common"
import { EntityManager, MikroORM } from "@mikro-orm/core"
import { InjectEntityManager, InjectMikroORM } from "@mikro-orm/nestjs"

@Injectable()
export class DatabaseService {
    constructor(
        // For Multiple Database
        @InjectMikroORM("postgreSql") private readonly mikroOrm: MikroORM,
        @InjectEntityManager("postgreSql") private readonly entityManager: EntityManager,

        // @InjectMikroORM("mariaDb") private readonly ormSecond: MikroORM,
        // @InjectEntityManager("mariaDb") private readonly emSecond: EntityManager
    ) {
        // Development
        this.initialDatabase()
    }

    async initialDatabase() {
        console.info("Initial Database ...")

        // For Sigle Database
        // await this.mikro.discoverEntities()
        // await this.mikro.schema.dropSchema()
        // await this.mikro.schema.createSchema()
        // await this.mikro.schema.updateSchema({safe: true})
        // await this.mikro.seeder.seed(SampleSeeder)

        // For Multiple Database
        await this.mikroOrm.schema.dropSchema()
        await this.mikroOrm.schema.createSchema()
        // await this.mikroOrm.schema.updateSchema({ safe: true })
        // await this.ormMain.schema.updateSchema({ safe: true })

        console.info("Initial Database Successful :)")
    }
}

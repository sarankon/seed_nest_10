import { Injectable } from "@nestjs/common"
import { EntityManager, MikroORM } from "@mikro-orm/core"
import { InjectEntityManager, InjectMikroORM } from "@mikro-orm/nestjs"

// import { SampleSeeder } from 'src/config/seeds/sample'

@Injectable()
export class DatabaseService {
    constructor(
        // For Single Database
        // private readonly mikro: MikroORM,
        // private readonly entityManager: EntityManager,

        // For Multiple Database
        @InjectMikroORM("main") private readonly ormMain: MikroORM,
        @InjectMikroORM("second") private readonly ormSecond: MikroORM,
    ) {
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
        // await this.ormMain.schema.dropSchema()
        await this.ormMain.schema.updateSchema({ safe: true })

        console.info("Initial Database Successful :)")
    }
}

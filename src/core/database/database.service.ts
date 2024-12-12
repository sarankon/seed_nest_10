// import { EntityManager, MikroORM } from '@mikro-orm/core';
import { EntityManager, MikroORM } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { SampleSeeder } from 'src/config/seeds/sample';


@Injectable()
export class DatabaseService {
    constructor(
        private readonly mikro: MikroORM,
        // private readonly entityManager: EntityManager,
    ) { 
        this.initialDatabase()
    }

    async initialDatabase() {
        console.info("Initial Database ...")
        // await this.mikro.discoverEntities()
        // await this.mikro.schema.dropSchema()
        // await this.mikro.schema.createSchema()
        // await this.mikro.schema.updateSchema({safe: true})
        // await this.mikro.seeder.seed(SampleSeeder)
        console.info("Initial Database Successful :)")
    }

}

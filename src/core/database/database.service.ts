// import { EntityManager, MikroORM } from '@mikro-orm/core';
import { EntityManager, MikroORM } from '@mikro-orm/sqlite';
import { Injectable } from '@nestjs/common';
import { Sample } from 'src/demo/sample/entities/sample.entity';

@Injectable()
export class DatabaseService {
    constructor(
        private readonly orm: MikroORM,
        private readonly em: EntityManager,
    ) { 
        this.initialDatabase()
    }

    async initialDatabase() {
        console.info("Initial Database ...")
        // await this.orm.discoverEntities()
        // await this.orm.schema.dropSchema()
        // await this.orm.schema.createSchema()
        await this.orm.schema.updateSchema({safe: true})
        console.info("Initial Database Successful :)")
    }
}

import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { SampleSeeder } from "./sample";


export class DatabaseSeeder extends Seeder {

    async run(entityManager: EntityManager): Promise<void> {
        return this.call(entityManager, [
            SampleSeeder
        ])
    }

}


import { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";


// export class SampleSeeder extends Seeder {

    // async run(entityManager: EntityManager): Promise<void> {
    //     for(const sampleData of sampleDataList) {
    //         const sample = new Sample()
    //         sample.id = sampleData.id
    //         sample.fullName = sampleData.fullName
    //         sample.email = sampleData.email
    //         sample.password = sampleData.password
    //         entityManager.persist(sample)
    //     }
    //     await entityManager.flush();
    // }

// }

// const sampleDataList:Array<Sample> = [
//     {
//         id: 1,
//         fullName: 'Sample 1',
//         email: 'sample@mail.com',
//         password: 'secret',
//     }
// ]
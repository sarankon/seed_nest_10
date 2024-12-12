import { Options } from "@mikro-orm/core";
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqliteDriver } from "@mikro-orm/sqlite";

const mikroConfig:Options = {
    // for simplicity, we use the SQLite database, as it's available pretty much everywhere
    driver: SqliteDriver,
    dbName: './db/mikro.sqlite',

    // folder-based discovery setup, using common filename suffix
    entities: ['./dist/**/*.entity.js'],
    entitiesTs: ['./src/**/*.entity.ts'],

    // we will use the ts-morph reflection, an alternative to the default reflect-metadata provider
    // check the documentation for their differences: https://mikro-orm.io/docs/metadata-providers
    metadataProvider: TsMorphMetadataProvider,

    // enable debug mode to log SQL queries and discovery information
    debug: true,

    // seed file
    seeder: {
        path: './dist/config/seeds', // path to the folder with seeders
        pathTs: './src/config/seeds', // path to the folder with TS seeders (if used, we should put path to compiled files in `path`)
        defaultSeeder: 'DatabaseSeeder', // default seeder class name
        glob: '!(*.d).{js,ts}',  // how to match seeder files (all .js and .ts files, but not .d.ts)
        emit: 'ts',  // seeder generation mode
        fileName: (className: string) => className,  // seeder file naming convention
    },
} 

export default mikroConfig
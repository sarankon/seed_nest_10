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

    seeder: {}
} 

export default mikroConfig
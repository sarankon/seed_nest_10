import { TsMorphMetadataProvider } from "@mikro-orm/reflection"
import { MikroOrmModuleSyncOptions } from "@mikro-orm/nestjs"

import { MariaDbDriver } from "@mikro-orm/mariadb"
import { PostgreSqlDriver } from "@mikro-orm/postgresql"

const postgreSqlConfig: MikroOrmModuleSyncOptions = {
    contextName: "postgreSql",
    registerRequestContext: false,

    driver: PostgreSqlDriver,
    host: "localhost",
    port: 5432,
    dbName: "seed_db",
    user: "seed_user",
    password: "seed_password",

    autoLoadEntities: true,
    entities: ["./dist/**/*.entity.js"],
    entitiesTs: ["./src/**/*.entity.ts"],

    metadataProvider: TsMorphMetadataProvider,
    debug: true,
}

const mariaDbConfig: MikroOrmModuleSyncOptions = {
    contextName: "mariaDb",
    registerRequestContext: false,

    driver: MariaDbDriver,
    host: "localhost",
    port: 3306,
    dbName: "seed_database",
    user: "seed_user",
    password: "seed_password",

    autoLoadEntities: true,
    entities: ["./dist/**/*.entity.js"],
    entitiesTs: ["./src/**/*.entity.ts"],

    metadataProvider: TsMorphMetadataProvider,
    debug: true,
}

const databaseConfig = {
    postgreSqlConfig: postgreSqlConfig,
    mariaDbConfig: mariaDbConfig,
}

export default databaseConfig

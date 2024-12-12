# Mikro-ORM
Reference: https://docs.nestjs.com/recipes/mikroorm
Reference: https://mikro-orm.io/docs/quick-start

## Install
``` bash
npm install @mikro-orm/cli @mikro-orm/core @mikro-orm/seeder @mikro-orm/reflection @mikro-orm/nestjs @mikro-orm/sqlite 
```

## Initial Config File
Reference: https://mikro-orm.io/docs/quick-start#setting-up-the-commandline-tool
``` bash
npx mikro-orm
```

Edit File :page_with_curl: package.json
``` json
"dependencies": {},
"mikro-orm": {
    "configPaths": [
      "./src/config/mikro-orm.config.ts",
      "./dist/config/mikro-orm.config.js"
    ]
 }
```

Create File :page_with_curl: ./src/config/mikro-orm.config.ts
``` ts
import { Options } from "@mikro-orm/core";
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqliteDriver } from "@mikro-orm/sqlite";

const mikroConfig:Options = {
    // for simplicity, we use the SQLite database, as it's available pretty much everywhere
    driver: SqliteDriver,
    dbName: './db/mikro.sqlite3',

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
```

Edit File :page_with_curl: app.module.ts
``` ts
//...
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SqliteDriver } from '@mikro-orm/sqlite';
import mikroConfig from './config/mikro-orm.config'; 

@Module({
  imports: [
    // ...
    MikroOrmModule.forRoot(mikroConfig),
  ],
  // ...
})
export class AppModule {}
```

Add EntityManager
``` bash
nest generate service core/database
```

## Schema Generator
Reference: https://mikro-orm.io/docs/schema-generator
``` bash
# Update Database
npx mikro-orm schema:update --run --safe
npx mikro-orm schema:drop --run

# !WARNING! Drops the database schema and recreates it
npx mikro-orm schema:fresh --run --seed

# Dumps create schema SQL
npx mikro-orm schema:create --dump

# Dumps update schema SQL
npx mikro-orm schema:update --dump

# Dumps drop schema SQL
npx mikro-orm schema:drop --dump
```

## Other Database
``` bash
# for mongodb
npm install @mikro-orm/core @mikro-orm/mongodb

# for mysql (works with mariadb too)
npm install @mikro-orm/core @mikro-orm/mysql

# for mariadb (works with mysql too)
npm install @mikro-orm/core @mikro-orm/mariadb

# for postgresql (works with cockroachdb too)
npm install @mikro-orm/core @mikro-orm/postgresql

# for sqlite
npm install @mikro-orm/core @mikro-orm/sqlite

# for better-sqlite
npm install @mikro-orm/core @mikro-orm/better-sqlite

# for libsql/turso
npm install @mikro-orm/core @mikro-orm/libsql

# for mssql
npm install @mikro-orm/core @mikro-orm/mssql
```
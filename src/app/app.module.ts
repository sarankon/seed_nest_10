import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

// Database
import { MikroOrmModule } from "@mikro-orm/nestjs"

// Config
import databaseConfig from "src/config/database.config"
import serverConfig from "src/config/server.config"

// Controllers and Services
import { AppController } from "./app.controller"
import { AppService } from "./app.service"

// Base Module
import { BaseModule } from "src/base/base.module"

@Module({
    imports: [
        // Config Environment
        ConfigModule.forRoot({
            cache: false,
            isGlobal: true,
            expandVariables: true,
            envFilePath: ["src/environments/development.env"],
            // envFilePath: ["src/environments/production.env"],
            load: [serverConfig],
        }),

        // ----- Database -----
        // For Multiple Database
        MikroOrmModule.forRoot(databaseConfig.postgreSqlConfig),
        // MikroOrmModule.forRoot(databaseConfig.mariaDbConfig),
        MikroOrmModule.forMiddleware(),

        // ----- Base Module -----
        BaseModule,

        // ----- Project Module -----
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}

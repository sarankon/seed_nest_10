import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
// Config
import { ConfigModule } from "@nestjs/config"

// Database
import { MikroOrmModule } from "@mikro-orm/nestjs"
import databaseConfig from "../config/database.config"

// Base
import { BaseModule } from "src/base/base.module"

@Module({
    imports: [
        // Config Environment
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['src/environments/local.env']
        }),

        // ----- Database -----
        // For Single Database
        // MikroOrmModule.forRoot(databaseConfig.sampleConfig),

        // For Multiple Database
        MikroOrmModule.forRoot(databaseConfig.mainConfig),
        MikroOrmModule.forRoot(databaseConfig.secondConfig),
        MikroOrmModule.forMiddleware(),

        // ----- Base Module -----
        BaseModule,

        // ----- Project Module -----
    ],
    controllers: [
        AppController
    ],
    providers: [
        AppService,
    ],
})
export class AppModule {}

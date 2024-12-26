import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"

// Database
import { MikroOrmModule } from "@mikro-orm/nestjs"
import databaseConfig from "../config/database.config"

// Base and Database
import { BaseModule } from "src/base/base.module"

// Demo
import { DemoModule } from "../demo/demo.module"
import { ConfigModule } from "@nestjs/config"

@Module({
    imports: [
        // Config Environment
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['src/environments/local.env']
        }),

        // For Single Database
        // MikroOrmModule.forRoot(databaseConfig.sampleConfig),

        // For Multiple Database
        MikroOrmModule.forRoot(databaseConfig.mainConfig),
        MikroOrmModule.forRoot(databaseConfig.secondConfig),
        MikroOrmModule.forMiddleware(),

        // --- Base Module
        BaseModule,
        DemoModule,

        // Project Module
    ],
    controllers: [
        AppController
    ],
    providers: [
        AppService,
    ],
})
export class AppModule {}

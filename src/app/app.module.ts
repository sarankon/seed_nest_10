import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"

// Config
import { ConfigModule } from "@nestjs/config"
import reportConfig from "src/config/report.config"
import databaseConfig from "src/config/database.config"

// Database
import { MikroOrmModule } from "@mikro-orm/nestjs"

// Base
import { BaseModule } from "src/base/base.module"
import serverConfig from "src/config/server.config"

@Module({
    imports: [
        // Config Environment
        ConfigModule.forRoot({
            cache: false,
            isGlobal: true,
            expandVariables: true,
            envFilePath: ["src/environments/local.env"],
            load: [serverConfig, reportConfig],
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

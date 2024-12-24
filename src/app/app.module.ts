import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"

// Database
import { MikroOrmModule } from "@mikro-orm/nestjs"
import mikroConfig from "../config/mikro-orm.config"

// Base and Database
import { BaseModule } from "src/base/base.module"

// Demo
import { DemoModule } from "../demo/demo.module"
import { APP_GUARD } from "@nestjs/core"
import { RolesGuard } from "src/base/auth/role/roles.guard"

@Module({
    imports: [
        // For Single Database
        // MikroOrmModule.forRoot(mikroConfig.sampleConfig),

        // For Multiple Database
        MikroOrmModule.forRoot(mikroConfig.mainConfig),
        MikroOrmModule.forRoot(mikroConfig.secondConfig),
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

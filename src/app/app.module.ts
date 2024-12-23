import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

// Demo
import { DemoModule } from '../demo/demo.module'

// Database
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { DatabaseService } from '../core/database/database.service'
import mikroConfig from '../config/mikro-orm.config'

// Security
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from '../config/jwt.config'

import { AuthModule } from '../core/auth/auth.module'
import { UsersModule } from '../core/users/users.module'
import { UploadModule } from '../base/upload/upload.module';


@Module({
    imports: [
        DemoModule,
        // For Single Database
        // MikroOrmModule.forRoot(mikroConfig.sampleConfig),
        // For Multiple Database
        MikroOrmModule.forRoot(mikroConfig.mainConfig),
        MikroOrmModule.forRoot(mikroConfig.secondConfig),
        MikroOrmModule.forMiddleware(),
        // Base Module
        AuthModule,
        UsersModule,
        UploadModule,
        // Project Module
    ],
    controllers: [AppController],
    providers: [
        AppService, 
        DatabaseService
    ],
})
export class AppModule {}

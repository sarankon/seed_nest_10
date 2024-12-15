import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

// Demo
import { DemoModule } from './demo/demo.module'

// Database
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { SqliteDriver } from '@mikro-orm/sqlite'
import { DatabaseService } from './core/database/database.service'
import mikroConfig from './config/mikro-orm.config'

// Security
import { JwtModule } from '@nestjs/jwt'
import { AuthModule } from './core/auth/auth.module'
import { UsersModule } from './core/users/users.module'
import { jwtConstants } from './config/jwt.config'
import { UploadModule } from './base/upload/upload.module';


@Module({
    imports: [
        DemoModule,
        MikroOrmModule.forRoot(mikroConfig),
        AuthModule,
        UsersModule,
        UploadModule
    ],
    controllers: [AppController],
    providers: [
        AppService, 
        DatabaseService
    ],
})
export class AppModule {}

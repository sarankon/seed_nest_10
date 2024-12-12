import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DemoModule } from './demo/demo.module';

// Database
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SqliteDriver } from '@mikro-orm/sqlite';
import mikroConfig from './config/mikro-orm.config';
import { DatabaseService } from './core/database/database.service';

// Security
import { AuthModule } from './core/auth/auth.module';
import { UsersModule } from './core/users/users.module';


@Module({
    imports: [
        DemoModule,
        MikroOrmModule.forRoot(mikroConfig),
        AuthModule,
        UsersModule,
    ],
    controllers: [AppController],
    providers: [
        AppService, 
        DatabaseService
    ],
})
export class AppModule {}

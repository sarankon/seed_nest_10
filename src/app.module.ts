import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DemoModule } from './demo/demo.module';

// Database
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SqliteDriver } from '@mikro-orm/sqlite';
import mikroConfig from './config/mikro-orm.config';
import { DatabaseService } from './core/service/database.service';

@Module({
  imports: [
    DemoModule,
    MikroOrmModule.forRoot(mikroConfig),
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    DatabaseService
  ],
})
export class AppModule {}

import { Module } from "@nestjs/common"

import { UserModule } from "./user/user.module"
import { AuthModule } from "./auth/auth.module"
import { UploadModule } from "./upload/upload.module"
import { InitialModule } from './initial/initial.module';
import { DatabaseService } from "./database/database.service";

@Module({
    imports: [
        UserModule,
        AuthModule,
        UploadModule,
        InitialModule,
    ],
    controllers: [],
    providers: [
        // DatabaseService
    ],
    exports: [],
})
export class BaseModule {}

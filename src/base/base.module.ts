import { Module } from "@nestjs/common"

import { DatabaseService } from "./database/database.service"

import { UserModule } from "./user/user.module"
import { AuthModule } from "./auth/auth.module"
import { UploadModule } from "./upload/upload.module"

@Module({
    imports: [
        UserModule,
        AuthModule,
        UploadModule,
    ],
    controllers: [],
    providers: [
        DatabaseService
    ],
    exports: [],
})
export class BaseModule {}

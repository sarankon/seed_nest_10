import { Module } from "@nestjs/common"

import { DatabaseService } from "./database/database.service"

import { UserModule } from "./user/user.module"
import { AuthenticationModule } from "./authentication/authentication.module"

@Module({
    imports: [
        UserModule,
        AuthenticationModule,
        // UploadModule,
        // ReportModule,
    ],
    controllers: [],
    providers: [DatabaseService],
    exports: [],
})
export class BaseModule {}

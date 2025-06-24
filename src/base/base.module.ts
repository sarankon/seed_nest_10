import { Module } from "@nestjs/common"

import { InitialModule } from './initial/initial.module';
import { DatabaseService } from "./database/database.service";

import { UserModule } from "./user/user.module"
import { AuthModule } from "./auth/auth.module"
// import { UploadModule } from "./upload/upload.module"
// import { ReportModule } from './report/report.module';

@Module({
    imports: [
        // InitialModule,
        // UserModule,
        // AuthModule,
        // UploadModule,
        // ReportModule,
    ],
    controllers: [],
    providers: [
        DatabaseService
    ],
    exports: [],
})
export class BaseModule {}

import { Module } from "@nestjs/common"
import { UserModule } from "./user/user.module"
import { UploadModule } from "./upload/upload.module"

@Module({
    providers: [],
    imports: [
        UserModule, 
        UploadModule
    ],
    exports: [],
})
export class BaseModule {}

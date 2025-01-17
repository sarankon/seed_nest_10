import { Module } from "@nestjs/common"
import { InitialController } from "./initial.controller"
import { InitialService } from "./initial.service"
import { UserService } from "../user/user.service"

@Module({
    imports: [],
    controllers: [InitialController],
    providers: [InitialService, UserService],
    exports: [],
})
export class InitialModule {}

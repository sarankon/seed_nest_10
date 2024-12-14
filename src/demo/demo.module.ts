import { Module } from "@nestjs/common"
import { SwaggerController } from "./swagger/swagger.controller"
import { CrudModule } from "./crud/crud.module"

@Module({
    controllers: [SwaggerController],
    imports: [CrudModule],
})
export class DemoModule {}

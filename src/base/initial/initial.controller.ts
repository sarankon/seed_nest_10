import { Controller, Get } from "@nestjs/common"
import { InitialService } from "./initial.service"

@Controller("initial")
export class InitialController {
    constructor(private readonly initialService: InitialService) {}

    @Get()
    async initialDatabase(): Promise<string> {
        await this.initialService.initialDatabase()
        return "done"
    }

    async updateSchema(): Promise<string> {
        await this.initialService.updateSchema()
        return "done"
    }
}

import { Injectable } from "@nestjs/common"

@Injectable()
export class AppService {
    getText(): string {
        return "Seed-NestJS-10"
    }
}

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common"
import { Observable } from "rxjs"

@Injectable()
export class FileExtender implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest()
        console.log(request.body.comment)
        // request.file["comment"] = request.body.comment
        // request.file["outletId"] = Number(request.body.outletId)
        return next.handle()
    }
}

import { Module } from "@nestjs/common"
import { MulterModule } from "@nestjs/platform-express"
import { diskStorage } from "multer"

import { UploadService } from "./upload.service"
import { UploadController } from "./upload.controller"

@Module({
    imports: [
        MulterModule.register({
            storage: diskStorage({
                destination: "./temp/uploads/",
                filename: (request, file, callback) => {
                    const filename = `${Date.now()}-${file.originalname}`
                    callback(null, filename)
                }
            }),
            fileFilter: (request, file, callback) => {
                console.log(file)
                const allowedMimeTypes = ["text/plain","image/jpeg", "image/png", "application/pdf"]
                if (!allowedMimeTypes.includes(file.mimetype)) {
                    callback(null, false)
                }
            },
            limits: {
                fileSize: 1048576,
            },
        }),
    ],
    controllers: [UploadController],
    providers: [UploadService],
})
export class UploadModule {}

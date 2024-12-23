import { Module } from "@nestjs/common"
import { MulterModule } from "@nestjs/platform-express"
import { diskStorage } from "multer"

import { UploadService } from "./upload.service"
import { UploadController } from "./upload.controller"

@Module({
    imports: [
        // *** Config in Controller
        // MulterModule.register({
        //     storage: diskStorage({
        //         destination: "./temp/uploads/",
        //         filename: (request, file, callback) => {
        //             const filename = `${Date.now()}-${file.originalname}`
        //             callback(null, filename)
        //         }
        //     }),
        //     fileFilter: (request, file, callback) => {
        //         console.log(file)
        //         const allowedMimeTypes = ["text/plain", "application/pdf", "image/jpeg", "image/png"]
        //         if (!allowedMimeTypes.includes(file.mimetype)) {
        //             callback(null, false)
        //         }
        //     },
        //     limits: {
        //         fileSize: 1048576,
        //     },
        // }),
    ],
    providers: [UploadService],
    controllers: [UploadController]
})
export class UploadModule {}

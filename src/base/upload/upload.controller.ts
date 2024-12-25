import { Controller, Get, Post, Param, Delete, UseInterceptors, UploadedFile } from "@nestjs/common"
import { ApiBody, ApiConsumes } from "@nestjs/swagger"
import { FileInterceptor } from "@nestjs/platform-express"
import { diskStorage } from "multer"

import { UploadService } from "./upload.service"
import uploadConfig from "../../config/upload.config"

@Controller("upload")
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post("file")
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                },
            },
        },
    })
    @UseInterceptors(
        FileInterceptor("file", {
            storage: diskStorage({
                destination: uploadConfig.filesPath,
                filename: (request, file, callback) => {
                    const filename = `${Date.now()}.${file.originalname.split(".").pop()}`
                    callback(null, filename)
                },
            }),
            limits: {
                fileSize: uploadConfig.filesLimit,
            },
        }),
    )
    // Use from Module
    // @UseInterceptors(FileInterceptor("file"))
    uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log("Upload File: ", file)
        return this.uploadService.uploadFile(file)
    }

    @Get("file/:id")
    findOneFile(@Param("id") id: string) {
        return this.uploadService.findOneFile(+id)
    }

    @Get("file")
    findAllFile() {
        return this.uploadService.findAllFile()
    }

    @Delete("file/:id")
    removeFile(@Param("id") id: string) {
        return this.uploadService.removeFile(+id)
    }

    // --- Document
    @Post("document")
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                },
            },
        },
    })
    @UseInterceptors(
        FileInterceptor("file", {
            storage: diskStorage({
                destination: uploadConfig.documentsPath,
                filename: (request, file, callback) => {
                    const filename = `${Date.now()}.${file.originalname.split(".").pop()}`
                    callback(null, filename)
                },
            }),
            fileFilter: (request, file, callback) => {
                console.log("documentsFilter: ", file)
                const allowedMimeTypes = uploadConfig.documentsFilter
                if (allowedMimeTypes.includes(file.mimetype)) {
                    console.log("Accept")
                    callback(null, true)
                } else {
                    console.log("Reject")
                    callback(null, false)
                }
            },
            limits: {
                fileSize: uploadConfig.documentsLimit,
            },
        }),
    )
    uploadDocument(@UploadedFile() file: Express.Multer.File) {
        console.log("Upload Document: ", file)
        return this.uploadService.uploadDocument(file)
    }

    @Get("document/:id")
    findOneDocument(@Param("id") id: string) {
        return this.uploadService.findOneDocument(+id)
    }

    @Get("document")
    findAllDocument() {
        return this.uploadService.findAllDocument()
    }

    @Delete("document/:id")
    removeDocument(@Param("id") id: string) {
        return this.uploadService.removeDocument(+id)
    }

    // --- Image
    @Post("image")
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                },
            },
        },
    })
    @UseInterceptors(
        FileInterceptor("file", {
            storage: diskStorage({
                destination: uploadConfig.imagesPath,
                filename: (request, file, callback) => {
                    const filename = `${Date.now()}.${file.originalname.split(".").pop()}`
                    callback(null, filename)
                },
            }),
            fileFilter: (request, file, callback) => {
                console.log("imagesFilter: ", file)
                const allowedMimeTypes = uploadConfig.imagesFilter
                if (allowedMimeTypes.includes(file.mimetype)) {
                    console.log("Accept")
                    callback(null, true)
                } else {
                    console.log("Reject")
                    callback(null, false)
                }
            },
            limits: {
                fileSize: uploadConfig.imagesLimit,
            },
        }),
    )
    uploadImage(@UploadedFile() file: Express.Multer.File) {
        console.log("Upload Images: ", file)
        return this.uploadService.uploadImage(file)
    }

    @Get("image/:id")
    findOneImage(@Param("id") id: string) {
        return this.uploadService.findOneImage(+id)
    }

    @Get("image")
    findAllImage() {
        return this.uploadService.findAllImage()
    }

    @Delete("image/:id")
    removeImage(@Param("id") id: string) {
        return this.uploadService.removeImage(+id)
    }
    
}

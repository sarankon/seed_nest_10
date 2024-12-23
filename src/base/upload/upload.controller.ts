import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from "@nestjs/common"
import { ApiBody, ApiConsumes, ApiProperty } from "@nestjs/swagger"
import { FileInterceptor } from "@nestjs/platform-express"
import { diskStorage } from "multer"

import uploadConfig from "../../config/upload.config"
import { UploadService } from "./upload.service"

@Controller()
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post("/upload/file")
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

    @Get("/upload/file/:id")
    findFile(@Param("id") id: string) {
        return this.uploadService.findFile(+id)
    }

    @Delete("/upload/file/:id")
    removeFile(@Param("id") id: string) {
        return this.uploadService.removeFile(+id)
    }

    @Get("/upload/file")
    findAll() {
        return this.uploadService.findAllFile()
    }

    // --- Document
    @Post("/upload/document")
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

    @Get("/upload/document/:id")
    findDocument(@Param("id") id: string) {
        return this.uploadService.findDocument(+id)
    }

    @Delete("/upload/document/:id")
    removeDocument(@Param("id") id: string) {
        return this.uploadService.removeDocument(+id)
    }

    @Get("/upload/document")
    findAllDocument() {
        return this.uploadService.findAllDocument()
    }

    // --- Image
    @Post("/upload/image")
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

    @Get("/upload/image/:id")
    findImage(@Param("id") id: string) {
        return this.uploadService.findImage(+id)
    }

    @Delete("/upload/image/:id")
    removeImage(@Param("id") id: string) {
        return this.uploadService.removeImage(+id)
    }

    @Get("/upload/image")
    findAllImage() {
        return this.uploadService.findAllImage()
    }
}

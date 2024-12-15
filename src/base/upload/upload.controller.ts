import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { ApiBody, ApiConsumes, ApiProperty } from "@nestjs/swagger"
// import { diskStorage } from "multer"

import { UploadService } from "./upload.service"
import { CreateUploadDto } from "./dto/create-upload.dto"
import { UpdateUploadDto } from "./dto/update-upload.dto"
import { FileExtender } from "./file-extender.interceptor"

@Controller("upload")
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post()
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                comment: { type: "string"},
                file: {
                    type: "string",
                    format: "binary",
                },
            },
        },
    })
    // changed to use registry at upload module
    // @UseInterceptors(
    //     FileInterceptor("file", {
    //         storage: diskStorage({
    //             destination: "./temp/uploads/",
    //             filename: (request, file, callback) => {
    //                 const filename = `${Date.now()}-${file.originalname}`
    //                 callback(null, filename)
    //             },
    //         }),
    //     }),
    // )
    @UseInterceptors(FileExtender)
    @UseInterceptors(FileInterceptor("file"))
    create(@UploadedFile() file: Express.Multer.File) {
        console.log("file", file)
        return this.uploadService.create(file)
    }

    @Get()
    findAll() {
        return this.uploadService.findAll()
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.uploadService.findOne(+id)
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateUploadDto: UpdateUploadDto) {
        return this.uploadService.update(+id, updateUploadDto)
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.uploadService.remove(+id)
    }
}

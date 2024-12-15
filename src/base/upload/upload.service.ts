import { unlink } from "node:fs/promises"

import { BadRequestException, Injectable } from "@nestjs/common"
import { CreateUploadDto } from "./dto/create-upload.dto"
import { UpdateUploadDto } from "./dto/update-upload.dto"

import { EntityManager } from "@mikro-orm/core"
import { ResponseBody } from "../dto/response-body.dto"
import { Upload } from "./entities/upload.entity"


@Injectable()
export class UploadService {
    constructor(private readonly em: EntityManager) {}

    async create(file: Express.Multer.File) {
        // check empty value
        if (!file) {
            // throw new BadRequestException("no file uploaded")
            throw new BadRequestException("invalid file type! or file is too large!")
        }

        // validate file type
        // ----- use fileFilter at MulterModule.register
        // const allowedMimeTypes = ["text/plain"]
        // if (!allowedMimeTypes.includes(file.mimetype)) {
        //     unlink(file.path).then(() => {
        //         throw new BadRequestException("invalid file type!")
        //     })
        // }

        // validate file size
        // 1048576 bytes = 1 MB
        // ----- use limits at MulterModule.register
        // const maxSize = 1048576 * 10
        // if (file.size > maxSize) {
        //     unlink(file.path).then(() => {
        //         throw new BadRequestException("file is too large!")
        //     })
        // }

        // return { message: "file uploaded successfully", file }

        console.log(file)
        const upload = new Upload()
        upload.originalFileName = file.originalname
        upload.filePath = file.path
        this.em.persist(upload)
        await this.em.flush()
        return new ResponseBody("200", upload)
    }

    async findAll() {
        const list = await this.em.findAll(Upload)
        console.log(list)
        return new ResponseBody("200", list)
    }

    findOne(id: number) {
        return `This action returns a #${id} upload`
    }

    update(id: number, updateUploadDto: UpdateUploadDto) {
        return `This action updates a #${id} upload`
    }

    remove(id: number) {
        return `This action removes a #${id} upload`
    }
}

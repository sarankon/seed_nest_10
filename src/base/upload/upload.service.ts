import { unlink } from "node:fs/promises"

import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { EntityManager } from "@mikro-orm/core"
import { InjectEntityManager } from "@mikro-orm/nestjs"

import { ResponseBody } from "../response-body"

import uploadConfig from "../../config/upload.config"
import { UploadFiles } from "./entities/upload-files.entity"
import { UploadDocuments } from "./entities/upload-documents.entity"
import { UploadImages } from "./entities/upload-images.entity"

@Injectable()
export class UploadService {
    constructor(
        // private readonly em: EntityManager
        @InjectEntityManager("main") private readonly em: EntityManager,
    ) {}

    // --- File
    async uploadFile(file: Express.Multer.File) {
        console.log(file)

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

        const upload = new UploadFiles()
        upload.originalFileName = file.originalname
        upload.mimeTypes = file.mimetype
        upload.name = file.filename
        upload.filePath = file.path
        upload.fileUrl = uploadConfig.filesUrl + file.filename
        this.em.persist(upload)
        await this.em.flush()
        return new ResponseBody("200", upload)
    }

    async findFile(id: number) {
        try {
            const entity = await this.em.findOneOrFail(UploadFiles, id)
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error(err.name)
            console.error(err.message)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    async removeFile(id: number) {
        try {
            const entity = await this.em.findOneOrFail(UploadFiles, id)
            this.em.remove(entity)
            await this.em.flush()
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error(err.name)
            console.error(err.message)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    async findAllFile() {
        const list = await this.em.findAll(UploadFiles)
        console.log(list)
        return new ResponseBody("200", list)
    }

    // --- Document
    async uploadDocument(file: Express.Multer.File) {
        console.log(file)

        // validate file
        if (!file) {
            throw new BadRequestException("invalid file type! or file is too large!")
        }

        const upload = new UploadDocuments()
        upload.originalFileName = file.originalname
        upload.mimeTypes = file.mimetype
        upload.name = file.filename
        upload.filePath = file.path
        upload.fileUrl = uploadConfig.documentsUrl + file.filename
        this.em.persist(upload)
        await this.em.flush()
        return new ResponseBody("200", upload)
    }

    async findDocument(id: number) {
        try {
            const entity = await this.em.findOneOrFail(UploadDocuments, id)
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error(err.name)
            console.error(err.message)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    async removeDocument(id: number) {
        try {
            const entity = await this.em.findOneOrFail(UploadDocuments, id)
            this.em.remove(entity)
            await this.em.flush()
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error(err.name)
            console.error(err.message)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    async findAllDocument() {
        const list = await this.em.findAll(UploadDocuments)
        console.log(list)
        return new ResponseBody("200", list)
    }

    // --- Image
    async uploadImage(file: Express.Multer.File) {
        console.log(file)

        // validate file
        if (!file) {
            throw new BadRequestException("invalid file type! or file is too large!")
        }

        const upload = new UploadImages()
        upload.originalFileName = file.originalname
        upload.mimeTypes = file.mimetype
        upload.name = file.filename
        upload.filePath = file.path
        upload.fileUrl = uploadConfig.imagesUrl + file.filename
        this.em.persist(upload)
        await this.em.flush()
        return new ResponseBody("200", upload)
    }

    async findImage(id: number) {
        try {
            const entity = await this.em.findOneOrFail(UploadImages, id)
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error(err.name)
            console.error(err.message)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    async removeImage(id: number) {
        try {
            const entity = await this.em.findOneOrFail(UploadImages, id)
            this.em.remove(entity)
            await this.em.flush()
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error(err.name)
            console.error(err.message)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    async findAllImage() {
        const list = await this.em.findAll(UploadImages)
        console.log(list)
        return new ResponseBody("200", list)
    }
}

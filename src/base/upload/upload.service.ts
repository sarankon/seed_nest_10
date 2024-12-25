import { unlink } from "node:fs/promises"

import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { EntityManager } from "@mikro-orm/core"
import { InjectEntityManager } from "@mikro-orm/nestjs"

import { ResponseBody } from "../response-body"

import uploadConfig from "../../config/upload.config"
import { _UploadFiles } from "./entities/upload-files.entity"
import { _UploadDocuments } from "./entities/upload-documents.entity"
import { _UploadImages } from "./entities/upload-images.entity"

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

        const upload = new _UploadFiles()
        upload.originalFileName = file.originalname
        upload.mimeTypes = file.mimetype
        upload.name = file.filename
        upload.filePath = file.path
        upload.fileUrl = uploadConfig.filesUrl + file.filename
        this.em.persist(upload)
        await this.em.flush()
        return new ResponseBody("200", upload)
    }

    async findAllFile() {
        const list = await this.em.findAll(_UploadFiles)
        console.log(list)
        return new ResponseBody("200", list)
    }

    async findOneFile(id: number) {
        try {
            const entity = await this.em.findOneOrFail(_UploadFiles, id)
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error(err.name)
            console.error(err.message)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    async removeFile(id: number) {
        try {
            const entity = await this.em.findOneOrFail(_UploadFiles, id)
            this.em.remove(entity)
            await this.em.flush()
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error(err.name)
            console.error(err.message)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    // --- Document
    async uploadDocument(file: Express.Multer.File) {
        console.log(file)

        // validate file
        if (!file) {
            throw new BadRequestException("invalid file type! or file is too large!")
        }

        const upload = new _UploadDocuments()
        upload.originalFileName = file.originalname
        upload.mimeTypes = file.mimetype
        upload.name = file.filename
        upload.filePath = file.path
        upload.fileUrl = uploadConfig.documentsUrl + file.filename
        this.em.persist(upload)
        await this.em.flush()
        return new ResponseBody("200", upload)
    }

    async findAllDocument() {
        const list = await this.em.findAll(_UploadDocuments)
        console.log(list)
        return new ResponseBody("200", list)
    }

    async findOneDocument(id: number) {
        try {
            const entity = await this.em.findOneOrFail(_UploadDocuments, id)
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error(err.name)
            console.error(err.message)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    async removeDocument(id: number) {
        try {
            const entity = await this.em.findOneOrFail(_UploadDocuments, id)
            this.em.remove(entity)
            await this.em.flush()
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error(err.name)
            console.error(err.message)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    // --- Image
    async uploadImage(file: Express.Multer.File) {
        console.log(file)

        // validate file
        if (!file) {
            throw new BadRequestException("invalid file type! or file is too large!")
        }

        const upload = new _UploadImages()
        upload.originalFileName = file.originalname
        upload.mimeTypes = file.mimetype
        upload.name = file.filename
        upload.filePath = file.path
        upload.fileUrl = uploadConfig.imagesUrl + file.filename
        this.em.persist(upload)
        await this.em.flush()
        return new ResponseBody("200", upload)
    }

    async findAllImage() {
        const list = await this.em.findAll(_UploadImages)
        console.log(list)
        return new ResponseBody("200", list)
    }

    async findOneImage(id: number) {
        try {
            const entity = await this.em.findOneOrFail(_UploadImages, id)
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error(err.name)
            console.error(err.message)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }

    async removeImage(id: number) {
        try {
            const entity = await this.em.findOneOrFail(_UploadImages, id)
            this.em.remove(entity)
            await this.em.flush()
            return new ResponseBody(200, entity)
        } catch (err) {
            console.error(err.name)
            console.error(err.message)
            throw new NotFoundException(`Data #id:${id} Not Found`)
        }
    }
}

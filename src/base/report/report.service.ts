import { BadRequestException, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { EntityManager } from "@mikro-orm/core"
import { InjectEntityManager } from "@mikro-orm/nestjs"

import { v4 as uuidv4 } from "uuid"
import { ResponseBody } from "../response-body"

import { writeFileSync } from "fs"
import * as ExcelJS from "exceljs"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { _ReportPDF } from "./entities/report-pdf.entity"
import { _ReportXLSX } from "./entities/report-xlsx.entity"

// import reportConfig from "../../config/report.config"

@Injectable()
export class ReportService {
    constructor(
        private readonly configService: ConfigService,
        @InjectEntityManager("main") private readonly em: EntityManager,
    ) {
        console.log("Environment : " + configService.get<string>("ENV"))
    }

    async exportCSV() {}

    async exportXLSX() {
        try {
            const workbook = new ExcelJS.Workbook()
            workbook.creator = "System"
            workbook.lastModifiedBy = "System"
            workbook.created = new Date()
            workbook.modified = new Date()

            const sheet1 = workbook.addWorksheet("Sheet 1")

            // ----- File Name And Path
            const fileName = uuidv4() + ".xlsx"
            const xlsxSavePath = this.configService.get<string>("XLSX_PATH")
            const xlsxFileUrl = this.configService.get<string>("XLSX_URL")

            // ----- Write File
            workbook.xlsx.writeFile(xlsxSavePath + fileName)

            // ----- Save Data To Database
            const reportXLSX = new _ReportXLSX()
            reportXLSX.name = fileName
            reportXLSX.originalFileName = fileName
            reportXLSX.filePath = xlsxSavePath
            reportXLSX.fileUrl = xlsxFileUrl + fileName
            reportXLSX.mimeTypes = "application/vnd.ms-excel"
            await this.em.persist(reportXLSX).flush()

            const hostUrl = this.configService.get<string>("HOST_URL")
            reportXLSX.fileUrl = hostUrl + reportXLSX.fileUrl

            return new ResponseBody(200, reportXLSX)
        } catch (err) {
            console.error("Error:", err)
            throw new BadRequestException({
                statusCode: 400,
                error: err.sqlMessage,
                message: "",
            })
        }
    }

    async exportPDF() {
        try {
            // Create a new PDFDocument
            const pdfDocument = await PDFDocument.create()
            // Add a blank page to the document
            const page = pdfDocument.addPage()
            // Get the width and height of the page
            const { width, height } = page.getSize()

            // Embed the Times Roman font
            const timesRomanFont = await pdfDocument.embedFont(StandardFonts.TimesRoman)
            // Draw a string of text toward the top of the page
            const fontSize = 30
            page.drawText("Creating PDFs in JavaScript is awesome!", {
                x: 50,
                y: height - 4 * fontSize,
                size: fontSize,
                font: timesRomanFont,
                color: rgb(0, 0.53, 0.71),
            })

            // Serialize the PDFDocument to bytes (a Uint8Array)
            const pdfBytes = await pdfDocument.save()

            // ----- File Name And Path
            const fileName = uuidv4() + ".pdf"
            const pdfSavePath = this.configService.get<string>("PDF_PATH")
            const pdfFileUrl = this.configService.get<string>("PDF_URL")

            // ----- Write File
            writeFileSync(pdfSavePath + fileName, pdfBytes)

            // ----- Save Data To Database
            const reportPDF = new _ReportPDF()
            reportPDF.name = fileName
            reportPDF.originalFileName = fileName
            reportPDF.filePath = pdfSavePath
            reportPDF.fileUrl = pdfFileUrl + fileName
            reportPDF.mimeTypes = "application/pdf"
            await this.em.persist(reportPDF).flush()

            const hostUrl = this.configService.get<string>("HOST_URL")
            reportPDF.fileUrl = hostUrl + reportPDF.fileUrl

            return new ResponseBody(200, reportPDF)
        } catch (err) {
            console.error("Error:", err)
            throw new BadRequestException({
                statusCode: 400,
                error: err.sqlMessage,
                message: "",
            })
        }
    }
}

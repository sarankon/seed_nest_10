import { BadRequestException, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { EntityManager } from "@mikro-orm/core"
import { InjectEntityManager } from "@mikro-orm/nestjs"

import { readFileSync, writeFileSync } from "fs"
import * as ExcelJS from "exceljs"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import fontkit from "@pdf-lib/fontkit"

import { v4 as uuidv4 } from "uuid"
import { ResponseBody } from "../response-body"

import { _ReportCSV } from "./entities/report-csv.entity"
import { _ReportXLSX } from "./entities/report-xlsx.entity"
import { _ReportPDF } from "./entities/report-pdf.entity"

@Injectable()
export class ReportService {
    constructor(
        private readonly configService: ConfigService,
        @InjectEntityManager("main") private readonly em: EntityManager,
    ) {
        console.log("Environment : " + configService.get<string>("ENV"))
    }

    async exportCSV() {
        try {
            const workbook = new ExcelJS.Workbook()
            workbook.creator = "System"
            workbook.lastModifiedBy = "System"
            workbook.created = new Date()
            workbook.modified = new Date()

            const worksheet = workbook.addWorksheet("Sheet 1")
            worksheet.columns = [
                { header: "Id", key: "id", width: 10 },
                { header: "Name", key: "name", width: 10 },
                { header: "D.O.B.", key: "dob", width: 10 },
            ]

            worksheet.addRow({ id: 1, name: "John", dob: new Date() })
            worksheet.addRow({ id: 2, name: "Doe", dob: new Date() })

            // ----- File Name And Path
            const fileName = uuidv4() + ".csv"
            const csvSavePath = this.configService.get<string>("CSV_PATH")
            const csvFileUrl = this.configService.get<string>("CSV_URL")

            // ----- Write File
            await workbook.csv.writeFile(csvSavePath + fileName)

            // ----- Save Data To Database
            const reportCSV = new _ReportCSV()
            reportCSV.name = fileName
            reportCSV.originalFileName = fileName
            reportCSV.filePath = csvSavePath
            reportCSV.fileUrl = csvFileUrl + fileName
            reportCSV.mimeTypes = "text/csv"
            await this.em.persist(reportCSV).flush()

            const hostUrl = this.configService.get<string>("HOST_URL")
            reportCSV.fileUrl = hostUrl + reportCSV.fileUrl

            return new ResponseBody(200, reportCSV)
        } catch (err) {
            console.error("Error:", err)
            throw new BadRequestException({
                statusCode: 400,
                error: err.sqlMessage,
                message: "",
            })
        }
    }

    async exportXLSX() {
        try {
            const workbook = new ExcelJS.Workbook()
            workbook.creator = "System"
            workbook.lastModifiedBy = "System"
            workbook.created = new Date()
            workbook.modified = new Date()

            const worksheet = workbook.addWorksheet("Sheet 1")
            worksheet.columns = [
                { header: "Id", key: "id", width: 10 },
                { header: "Name", key: "name", width: 10 },
                { header: "D.O.B.", key: "dob", width: 10 },
            ]

            worksheet.addRow({ id: 1, name: "John", dob: new Date() })
            worksheet.addRow({ id: 2, name: "Doe", dob: new Date() })

            // ----- File Name And Path
            const fileName = uuidv4() + ".xlsx"
            const xlsxSavePath = this.configService.get<string>("XLSX_PATH")
            const xlsxFileUrl = this.configService.get<string>("XLSX_URL")

            // ----- Write File
            await workbook.xlsx.writeFile(xlsxSavePath + fileName)

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
            pdfDocument.registerFontkit(fontkit)
            // Add a blank page to the document
            const page = pdfDocument.addPage([595, 842])
            // Get the width and height of the page
            const { width, height } = page.getSize()

            // Embed the Times Roman font
            const timesRomanFont = await pdfDocument.embedFont(StandardFonts.TimesRoman)
            // Draw a string of text toward the top of the page
            const fontSize = 30
            page.drawText("PDF", {
                x: 50,
                y: height - 4 * fontSize,
                size: fontSize,
                font: timesRomanFont,
                color: rgb(0, 0.53, 0.71),
            })

            // Add Font Barcode Font
            const fontBytes = readFileSync("./public/fonts/libre_barcode_128/libre_barcode_128-regular.ttf")
            console.log(fontBytes.length)
            // const libreBarcode128Font = await pdfDocument.embedFont(fontBytes)
            // page.drawText("10005", {
            //     x: 50,
            //     y: height - 4 * fontSize,
            //     size: fontSize,
            //     font: libreBarcode128Font,
            //     color: rgb(0, 0.53, 0.71),
            // })

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

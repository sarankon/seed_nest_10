import { BadRequestException, Injectable } from "@nestjs/common"
import { EntityManager } from "@mikro-orm/core"
import { InjectEntityManager } from "@mikro-orm/nestjs"
import reportConfig from "../../config/report.config"

import * as FileSystem from "fs"
import * as ExcelJS from "exceljs"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import * as FontKit from "@pdf-lib/fontkit"

import { v4 as uuidv4 } from "uuid"
import { ResponseBody } from "../response-body"

import { _ReportCSV } from "./entities/report-csv.entity"
import { _ReportXLSX } from "./entities/report-xlsx.entity"
import { _ReportPDF } from "./entities/report-pdf.entity"


@Injectable()
export class ReportService {

    constructor(
        @InjectEntityManager("main") private readonly em: EntityManager,
    ) {
        // --- Check Report Path and Initil Folder
        if (!FileSystem.existsSync(reportConfig().reportPath)) {
            FileSystem.mkdirSync(reportConfig().reportPath)

            if (!FileSystem.existsSync(reportConfig().csvPath)) {
                FileSystem.mkdirSync(reportConfig().csvPath)
            }
            if (!FileSystem.existsSync(reportConfig().xlsxPath)) {
                FileSystem.mkdirSync(reportConfig().xlsxPath)
            }
            if (!FileSystem.existsSync(reportConfig().pdfPath)) {
                FileSystem.mkdirSync(reportConfig().pdfPath)
            }
        }

        // --- Check Font File Path

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
            const csvSavePath = reportConfig().csvPath
            const csvFileUrl = reportConfig().csvUrl

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

            const hostUrl = reportConfig().hostUrl
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
            const xlsxSavePath = reportConfig().xlsxPath
            const xlsxFileUrl = reportConfig().xlsxUrl

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

            const hostUrl = reportConfig().hostUrl
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
            const fontPath = "./public/fonts/libre_barcode_128/libre_barcode_128-regular.ttf"

            if (!FileSystem.existsSync(fontPath)) {
                throw new Error(`Font file not found at: ${fontPath}`)
            }

            const fontByte = FileSystem.readFileSync(fontPath)
            if (fontByte.length === 0) {
                throw new Error(`Font file is empty: ${fontPath}`)
            }

            // Create a new PDFDocument
            const pdfDocument = await PDFDocument.create()
            pdfDocument.registerFontkit(FontKit)
            // Add a blank page to the document
            const page = pdfDocument.addPage([595, 842])
            // Get the width and height of the page
            const { width, height } = page.getSize()

            // Embed the Times Roman font
            const timesRomanFont = await pdfDocument.embedFont(StandardFonts.TimesRoman)
            // Draw a string of text toward the top of the page
            const fontSize = 30
            // page.drawText("PDF", {
            //     x: 50,
            //     y: height - 4 * fontSize,
            //     size: fontSize,
            //     font: timesRomanFont,
            //     color: rgb(0, 0.53, 0.71),
            // })

            // Add Font Barcode Font
            const fontBytes = FileSystem.readFileSync("./public/fonts/libre_barcode_128/libre_barcode_128-regular.ttf")
            const libreBarcode128Font = await pdfDocument.embedFont(fontBytes, { subset: true })
            page.drawText(this.encodeToCode128("10005"), {
                x: 50,
                y: height - 4 * fontSize,
                size: fontSize,
                font: libreBarcode128Font,
            })

            // Serialize the PDFDocument to bytes (a Uint8Array)
            const pdfBytes = await pdfDocument.save()

            // ----- File Name And Path
            const fileName = uuidv4() + ".pdf"
            const pdfSavePath = reportConfig().pdfPath
            const pdfFileUrl = reportConfig().pdfUrl

            // ----- Write File
            FileSystem.writeFileSync(pdfSavePath + fileName, pdfBytes)

            // ----- Save Data To Database
            const reportPDF = new _ReportPDF()
            reportPDF.name = fileName
            reportPDF.originalFileName = fileName
            reportPDF.filePath = pdfSavePath
            reportPDF.fileUrl = pdfFileUrl + fileName
            reportPDF.mimeTypes = "application/pdf"
            await this.em.persist(reportPDF).flush()

            const hostUrl = reportConfig().hostUrl
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

    // Barcode Encoder
    checkSum128(data, startCode) {
        let sum = startCode
        for (let i = 0; i < data.length; i++) {
            const code = data.charCodeAt(i)
            const value = code > 199 ? code - 100 : code - 32
            sum += (i + 1) * value
        }

        let checksum = (sum % 103) + 32
        if (checksum > 126) checksum = checksum + 68
        return String.fromCharCode(checksum)
    }

    toSetC(text) {
        return text
            .match(/\d{2}/g)
            .map((ascii, index) => {
                const codeC = Number(ascii)
                const charCode = codeC > 94 ? codeC + 100 : codeC + 32
                return String.fromCharCode(charCode)
            })
            .join("")
    }

    encodeToCode128(text, codeABC = "B") {
        const startCode = String.fromCharCode(codeABC.toUpperCase().charCodeAt(0) + 138)
        const stop = String.fromCharCode(206)

        text = (codeABC == "C" && this.toSetC(text)) || text

        const check = this.checkSum128(text, startCode.charCodeAt(0) - 100)

        text = text.replace(" ", String.fromCharCode(194))

        return startCode + text + check + stop
    }
}

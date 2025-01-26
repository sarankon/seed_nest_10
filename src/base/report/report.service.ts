import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { EntityManager } from "@mikro-orm/core"
import { InjectEntityManager } from "@mikro-orm/nestjs"

import { writeFileSync } from "fs"
import * as ExcelJS from "exceljs"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

import reportConfig from "../../config/report.config"

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
        const workbook = new ExcelJS.Workbook()
        // workbook.creator = "Me"
        // workbook.lastModifiedBy = "Her"
        // workbook.created = new Date(1985, 8, 30)
        // workbook.modified = new Date()
        // workbook.lastPrinted = new Date(2016, 9, 27)

        const sheet1 = workbook.addWorksheet("Sheet 1")
        const sheet2 = workbook.addWorksheet("Sheet 2")
        const sheet3 = workbook.addWorksheet("Sheet 1")

        workbook.xlsx.writeFile("./file.xlsx")
    }

    async exportPDF() {
        // Create a new PDFDocument
        const pdfDoc = await PDFDocument.create()

        // Embed the Times Roman font
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

        // Add a blank page to the document
        const page = pdfDoc.addPage()

        // Get the width and height of the page
        const { width, height } = page.getSize()

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
        const pdfBytes = await pdfDoc.save()

        await writeFileSync("./file.pdf", pdfBytes)
    }
}

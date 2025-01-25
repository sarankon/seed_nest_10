import { Controller, Get } from "@nestjs/common"
import { PdfService } from "./pdf.service"

import { PDFDocument, StandardFonts, rgb } from "pdf-lib"

@Controller("pdf")
export class PdfController {
    constructor(private readonly pdfService: PdfService) {}

    @Get()
    async createPdf() {
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

        
    }
}

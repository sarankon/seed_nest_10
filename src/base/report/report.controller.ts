import { Controller, Get } from "@nestjs/common"
import { ReportService } from "./report.service"

@Controller("report")
export class ReportController {
    constructor(private readonly reportService: ReportService) {}

    @Get("/export-csv")
    exportCsv() {
        return this.reportService.exportCSV()
    }

    @Get("/export-xlsx")
    exportXLSX() {
        return this.reportService.exportXLSX()
    }

    @Get("/export-pdf")
    exportPdf() {
        return this.reportService.exportPDF()
    }
}

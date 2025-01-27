export default () => ({
    // Host URL
    hostUrl: process.env.HOST_URL,
    
    // Report Path
    reportPath: process.env.REPORT_PATH,
    reportUrl: process.env.REPORT_URL,

    // CSV File
    csvPath: process.env.CSV_PATH,
    csvUrl: process.env.CSV_URL,

    // XLSX File
    xlsxPath: process.env.XLSX_PATH,
    xlsxUrl: process.env.XLSX_URL,

    // PDF File
    pdfPath: process.env.PDF_PATH,
    pdfUrl: process.env.PDF_URL,
})
const uploadConfig = {

    // Upload File
    filesPath: "./public/upload/files",
    filesUrl: "/upload/files/",
    // No filter
    // filesFilter: [], 
    filesLimit: 10485760,

    // Upload Document
    documentsPath: "./public/upload/documents",
    documentsUrl: "/upload/documents/",
    documentsFilter: ["text/plain","application/pdf"],
    documentsLimit: 10485760,

    // Upload Image
    imagesPath: "./public/upload/images",
    imagesUrl: "/upload/images/",
    imagesFilter: ["image/jpeg","image/png"],
    imagesLimit: 10485760,
}

// File Size 1048576 = 1MB

export default uploadConfig

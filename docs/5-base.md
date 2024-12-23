# Base Module
``` bash
nest generate module base
```

# Upload Service

Reference: https://docs.nestjs.com/techniques/file-upload
``` bash
npm i --save-dev @types/multer
```

``` bash
nest generate resource base/upload
```

## Create File For Test
``` bash
fsutil file createnew Empty-1B.txt 1
fsutil file createnew Empty-1KB.txt 1024
fsutil file createnew Empty-1MB.txt 1048576
fsutil file createnew Empty-10MB.txt 10485760
```

## File Type
Reference: https://developer.mozilla.org/en-US/docs/Web/HTTP/MIME_types/Common_types

# User Service
``` bash
nest generate resource base/user
```
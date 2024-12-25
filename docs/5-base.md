# Base Module
``` bash
nest generate module base
```

# User Service and Authen Service
``` bash
npm install uuid
npm install bcrypt
npm install --save-dev @types/bcrypt
```

``` bash
nest generate resource base/user
```

``` bash
nest generate service base/auth
nest generate controller base/auth
```

# Upload Service

Reference: https://docs.nestjs.com/techniques/file-upload
``` bash
npm i --save-dev @types/multer
```

``` bash
nest generate resource base/upload

# nest generate module base/upload/file
# nest generate controller base/upload/file
# nest generate module base/upload/document
# nest generate controller base/upload/document
# nest generate module base/upload/image
# nest generate controller base/upload/document
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


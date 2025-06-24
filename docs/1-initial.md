# Initial Project
``` bash
npm install -g @nestjs/cli@10
nest new seed_nest_10
```

? Which package manager would you ❤️ to use? npm

# Basic Workflow
``` bash
nest --help
nest generate --help
```

# Run Project
``` bash
npm run start
npm run start:dev
npm run start:debug
```

http://localhost:3000
```
Hello World!
```

## Change Express to Fastify
Benchmarks: https://fastify.dev/benchmarks/
``` bash
npm install @nestjs/platform-fastify
```
Edit file :page_with_curl: main.ts
``` ts
import { NestFactory } from "@nestjs/core"
import { NestExpressApplication } from "@nestjs/platform-express"
import { NestFastifyApplication } from "@nestjs/platform-fastify"
import { AppModule } from "./app.module"

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  // const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const app = await NestFactory.create<NestFastifyApplication>(AppModule)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
```

# Install Swagger (OpenAPI)
``` bash
npm install --save @nestjs/swagger
```

Edit file :page_with_curl: main.ts
``` ts
// ...
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from "@nestjs/swagger"

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Seed Nest 10")
    .setDescription("Seed Nest API Description")
    .setVersion("1.0")
    .addBasicAuth()
    .addBearerAuth()
    .build()
  const options = SwaggerDocumentOptions = {}
  const documentFactory = () => SwaggerModule.createDocument(app, config, options)
  SwaggerModule.setup("swagger", app, documentFactory)
  

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
```
Swagger UI: http://localhost:3000/swagger <br />
Generate JSON: http://localhost:3000/swagger-json

:page_with_curl: main.ts
``` ts
// HINT Change JSON Path 
// http://localhost:3000/swagger/json
SwaggerModule.setup('api', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
})
```

# Config
``` bash
npm install --save @nestjs/config
```

# PDF Lib
PDF Lib <br />
https://pdf-lib.js.org/ <br />
``` bash
npm install pdf-lib
```
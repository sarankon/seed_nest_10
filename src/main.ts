import { NestFactory } from "@nestjs/core"
import { NestExpressApplication } from "@nestjs/platform-express"
// import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerDocumentOptions, SwaggerModule } from "@nestjs/swagger"

import { join } from "path"

import { AppModule } from "./app/app.module"
import serverConfig from "./config/server.config"

async function bootstrap() {
    // const app = await NestFactory.create(AppModule)
    const app = await NestFactory.create<NestExpressApplication>(AppModule)
    // const app = await NestFactory.create<NestFastifyApplication>(AppModule);

    // Enable CORS (Cross-Origin Resource Sharing)
    // This allows the API to be accessed from different origins (e.g., frontend applications)
    app.enableCors()

    // Static Assets (Public Directory for Serving Files)
    app.useStaticAssets(join(__dirname, "..", "public"))

    // Setup Swagger for API Documentation
    // Swagger is a tool that helps document and test APIs
    const config = new DocumentBuilder()
        .setTitle("Seed Nest 10 (Example)")
        .setDescription("Seed Nest API Description")
        .setVersion("1.0")
        .addServer("http://localhost:" + serverConfig().port)
        .addBasicAuth()
        .addBearerAuth()
        .build()
    
    // SwaggerDocumentOptions allows customization of the Swagger document
    const options: SwaggerDocumentOptions = {
        operationIdFactory: (controllerKey: string, methodKey: string) => {
            const controllerName = controllerKey.replace("Controller", "").toLowerCase()
            switch(controllerName) {
                case 'auth' :
                    // return controllerName + "_" + methodKey
                    return methodKey
                case 'upload':
                    return methodKey
                default:
                    return methodKey + "_" + controllerName
            }
        }
    }

    // Create the Swagger document using the configuration and options
    const documentFactory = () => SwaggerModule.createDocument(app, config, options)
    SwaggerModule.setup("swagger", app, documentFactory)

    await app.listen(process.env.PORT ?? serverConfig().port)
}
bootstrap()
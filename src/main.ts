import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app/app.module"
// import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    // const app = await NestFactory.create<NestFastifyApplication>(AppModule);

    app.enableCors()

    const config = new DocumentBuilder()
        .setTitle("Seed Nest 10 (Example)")
        .setDescription("Seed Nest API Description")
        .setVersion("1.0")
        .addServer("http://localhost:3000")
        .addBasicAuth()
        .addBearerAuth()
        .build()
    const documentFactory = () => SwaggerModule.createDocument(app, config)
    SwaggerModule.setup("swagger", app, documentFactory)

    await app.listen(process.env.PORT ?? 3000)
}
bootstrap()

import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app/app.module";
import { Logger } from "nestjs-pino";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle("Notification Microservice")
    .setDescription("Notification API description")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("docs", app, document);

  app.enableCors();
  app.useLogger(app.get(Logger));

  await app.startAllMicroservices();

  await app.listen(3000);

  console.log("Notification Microservice is listening");
}

bootstrap();

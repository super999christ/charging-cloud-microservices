import { Module, RequestMethod } from "@nestjs/common";
import { AuthenticationModule } from "../authentication/authentication.module";
import { AppController } from "./app.controller";
import { LoggerModule } from "nestjs-pino";

@Module({
  controllers: [AppController],
  imports: [
    AuthenticationModule,
    LoggerModule.forRoot({
      exclude: [{ method: RequestMethod.ALL, path: "healthz" }],
    }),
  ],
})
export class AppModule {}

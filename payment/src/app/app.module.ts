import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { PaymentModule } from "../services/payment/payment.module";
import { LoggerModule } from "nestjs-pino";

@Module({
  imports: [
    ConfigModule.forRoot(),
    PaymentModule,
    LoggerModule.forRoot({
      exclude: [{ method: RequestMethod.ALL, path: "healthz" }],
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: "/healthz", method: RequestMethod.GET })
      .forRoutes("*");
  }
}

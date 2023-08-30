import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { PaymentModule } from "../services/payment/payment.module";

@Module({
  imports: [ConfigModule.forRoot(), PaymentModule],
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

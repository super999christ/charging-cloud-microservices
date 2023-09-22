import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { typeOrmConfig } from "../typeorm/typeorm.config";
import { EmailNotificationModule } from "../database/email-notification/email-notification.module";
import { SMSNotificationModule } from "../database/sms-notification/sms-notification.module";
import { TwilioModule } from "../services/twilio/twilio.module";
import { AppController } from "./app.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { EmailModule } from "../services/email/email.module";
import { EventNotificationModule } from "../database/event-notification/event-notification.module";

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmConfig),
    TwilioModule,
    EmailModule,
    EmailNotificationModule,
    SMSNotificationModule,
    EventNotificationModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware).forRoutes();
  }
}

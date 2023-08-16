import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppDataSource } from "../../typeorm/datasource";
import { SMSNotification } from "./sms-notification.entity";
import { SMSNotificationService } from "./sms-notification.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([SMSNotification], AppDataSource)
  ],
  providers: [SMSNotificationService],
  exports: [SMSNotificationService]
})
export class SMSNotificationModule {

}
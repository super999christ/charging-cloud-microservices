import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppDataSource } from "../../typeorm/datasource";
import { EmailNotification } from "./email-notification.entity";
import { EmailNotificationService } from "./email-notification.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailNotification], AppDataSource)
  ],
  providers: [EmailNotificationService],
  exports: [EmailNotificationService]
})
export class EmailNotificationModule {

}
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppDataSource } from "../../typeorm/datasource";
import { EventNotification } from "./event-notification.entity";
import { EventNotificationService } from "./event-notification.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([EventNotification], AppDataSource)
  ],
  providers: [EventNotificationService],
  exports: [EventNotificationService]
})
export class EventNotificationModule {

}
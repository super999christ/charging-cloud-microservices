import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { EventNotification } from "./event-notification.entity";

@Injectable()
export class EventNotificationService {
  @InjectRepository(EventNotification)
  private eventNotificationRepository: Repository<EventNotification>;

  public async saveNotification(notificationDetail: DeepPartial<EventNotification>) {
    return this.eventNotificationRepository.save(notificationDetail);
  }
};
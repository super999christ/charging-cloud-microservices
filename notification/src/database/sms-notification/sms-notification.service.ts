import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { ValidateSMSAuthCodeDto } from "../../app/dtos/ValidateSMSAuthCode.dto";
import { SMSNotification } from "./sms-notification.entity";

@Injectable()
export class SMSNotificationService {
  @InjectRepository(SMSNotification)
  private smsNotificationRepository: Repository<SMSNotification>;

  public async saveNotification(notificationDetail: DeepPartial<SMSNotification>) {
    return this.smsNotificationRepository.save(notificationDetail);
  }

  public async validateAuthCode(options: ValidateSMSAuthCodeDto) {
    const { notificationId, authCode, phoneNumber } = options;
    const notification = await this.smsNotificationRepository.findOneBy({ id: notificationId });
    if (notification) {
      if (notification.authCode === authCode && notification.recipientPhone === phoneNumber) {
        return notification;
      }
      return null;
    } else {
      return null;
    }
  }
};
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeepPartial, Repository } from "typeorm";
import { ValidateEmailAuthCodeDto } from "../../app/dtos/ValidateEmailAuthCode.dto";
import { EmailNotification } from "./email-notification.entity";

@Injectable()
export class EmailNotificationService {
  @InjectRepository(EmailNotification)
  private emailNotificationRepository: Repository<EmailNotification>;

  public async saveNotification(notificationDetail: DeepPartial<EmailNotification>) {
    return this.emailNotificationRepository.save(notificationDetail);
  }

  public async validateAuthCode(options: ValidateEmailAuthCodeDto) {
    const { notificationId, authCode, email } = options;
    const notification = await this.emailNotificationRepository.findOneBy({ id: notificationId });
    if (notification) {
      if (notification.authCode === authCode && notification.recipientEmail === email) {
        return notification;
      }
      return null;
    } else {
      return null;
    }
  }
};
import {
  Body,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Response,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import Environment from "../config/env";
import { Response as IResponse } from "express";
import { SMSNotificationService } from "../database/sms-notification/sms-notification.service";
import { TwilioService } from "../services/twilio/twilio.service";
import { EmailService } from "../services/email/email.service";
import { SendSMSAuthCodeDto } from "./dtos/SendSMSAuthCode.dto";
import { ValidateSMSAuthCodeDto } from "./dtos/ValidateSMSAuthCode.dto";
import { EmailNotificationService } from "../database/email-notification/email-notification.service";
import { SendEmailAuthCodeDto } from "./dtos/SendEmailAuthCode.dto";
import { ValidateEmailAuthCodeDto } from "./dtos/ValidateEmailAuthCode.dto";
import { SendPasswordResetLink } from "./dtos/SendPasswordResetLink.dto";
import { SendChargingEventCompletedDto } from "./dtos/SendChargingEventCompleted.dto";
import { EventNotificationService } from "../database/event-notification/event-notification.service";

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  @Inject()
  private twilioService: TwilioService;
  @Inject()
  private emailService: EmailService;
  @Inject()
  private smsNotificationService: SMSNotificationService;
  @Inject()
  private emailNotificationService: EmailNotificationService;
  @Inject()
  private eventNotificationService: EventNotificationService;

  @Post("send-sms-authcode")
  @ApiOperation({ summary: "Send SMS AuthCode notification" })
  @ApiBearerAuth()
  public async sendSMSAuthCode(
    @Body() sendSMSAuthCodeDto: SendSMSAuthCodeDto,
    @Response() response: IResponse
  ) {
    const { phoneNumber } = sendSMSAuthCodeDto;
    const isValid = await this.twilioService.isValidPhoneNumber(phoneNumber);
    if (!isValid) {
      response.status(401).send({ message: "Invalid phone number" });
      return;
    }
    const authCode = this.twilioService.generateAuthCode();
    const authMessage = `Your authorization code for NXU charging: ${authCode}`;
    const notification = await this.smsNotificationService.saveNotification({
      appName: "charging",
      senderPhone: Environment.TWILIO_PHONE_NUMBER,
      recipientPhone: phoneNumber,
      message: authMessage,
      notificationStatus: "sent",
      authCode,
      verified: false,
    });
    this.twilioService
      .sendSMS(phoneNumber, authMessage)
      .catch((err) =>
        this.logger.error("Failed to send sms auth code.", JSON.stringify(err))
      );
    response.status(200).send(notification);
  }

  @Post("validate-sms-authcode")
  @ApiOperation({ summary: "Validate SMS AuthCode" })
  @ApiBearerAuth()
  public async validateSMSAuthCode(
    @Body() body: ValidateSMSAuthCodeDto,
    @Response() response: IResponse
  ) {
    const notification = await this.smsNotificationService.validateAuthCode(
      body
    );
    if (notification) {
      notification.verified = true;
      await this.smsNotificationService.saveNotification(notification);
      response.status(200).send(notification);
    } else {
      response.status(401).send({ message: "Invalid AuthCode" });
    }
  }

  @Post("send-email-authcode")
  @ApiOperation({ summary: "Send Email AuthCode notification" })
  @ApiBearerAuth()
  public async sendEmailAuthCode(
    @Body() sendEmailAuthCodeDto: SendEmailAuthCodeDto,
    @Response() response: IResponse
  ) {
    const { email, paramString } = sendEmailAuthCodeDto;
    const authCode = this.emailService.generateAuthCode();
    const notification = await this.emailNotificationService.saveNotification({
      senderName: "ChargingApp",
      notificationStatus: "sent",
      recipientEmail: email,
      emailSubject: "Verify your email to start using ChargingApp",
      emailBody: "",
      authCode,
    });
    const authMessage = `Please click the below link to verify your email\n${Environment.FRONTEND_URL}/confirm-register?${paramString}`;
    notification.emailBody = authMessage;
    await this.emailNotificationService.saveNotification(notification);

    this.emailService
      .sendEmail(email, notification.emailSubject, notification.emailBody)
      .catch((err) =>
        this.logger.error("Failed to send email auth code", JSON.stringify(err))
      );
    response.status(200).send(notification);
  }

  @Post("validate-email-authcode")
  @ApiOperation({ summary: "Validate Email AuthCode" })
  @ApiBearerAuth()
  public async validateEmailAuthCode(
    @Body() body: ValidateEmailAuthCodeDto,
    @Response() response: IResponse
  ) {
    const notification = await this.emailNotificationService.validateAuthCode(
      body
    );
    if (notification) {
      notification.verified = true;
      await this.emailNotificationService.saveNotification(notification);
      response.status(200).send(notification);
    } else {
      response.status(401).send({ message: "Invalid AuthCode" });
    }
  }

  @Post("send-password-reset-request")
  @ApiOperation({ summary: "Send Password Reset notification" })
  @ApiBearerAuth()
  public async sendPasswordResetEmail(
    @Body() sendPasswordResetLinkDto: SendPasswordResetLink,
    @Response() response: IResponse
  ) {
    const { email, paramString } = sendPasswordResetLinkDto;
    const authCode = this.emailService.generateAuthCode();
    const notification = await this.emailNotificationService.saveNotification({
      senderName: "ChargingApp",
      notificationStatus: "sent",
      recipientEmail: email,
      emailSubject: "Reset Password of ChargingApp Account",
      emailBody: "",
      authCode,
    });
    const authMessage = `Please click the below link to reset your password\n${Environment.FRONTEND_URL}/set-password?${paramString}`;
    notification.emailBody = authMessage;
    await this.emailNotificationService.saveNotification(notification);

    this.emailService
      .sendEmail(email, notification.emailSubject, notification.emailBody)
      .catch((err) =>
        this.logger.error(
          "Failed to send password reset request",
          JSON.stringify(err)
        )
      );
    response.status(200).send(notification);
  }

  @Post("send-event-completed")
  @ApiOperation({ summary: "Send ChargingEvent completed notification" })
  @ApiBearerAuth()
  public async sendChargingEventCompleted(
    @Body() body: SendChargingEventCompletedDto,
    @Response() response: IResponse
  ) {
    const { type, eventId, email, phoneNumber } = body;
    if (type === "email") {
      await this.emailService.sendEmail(
        email!,
        "Charging Completed",
        `EventId=${eventId}`
      );
    } else {
      await this.twilioService.sendSMS(
        phoneNumber!,
        `Charging Completed with EventId=${eventId}`
      );
    }
    const notification = await this.eventNotificationService.saveNotification({
      isComplete: true,
      eventId,
      type,
    });
    response.status(200).send(notification);
  }

  @Get("healthz")
  public async healthz(@Response() res: IResponse) {
    return res.sendStatus(200);
  }
}

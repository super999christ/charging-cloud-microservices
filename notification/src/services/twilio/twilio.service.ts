import { Injectable } from "@nestjs/common";
import { Twilio } from 'twilio';
import Environment from "../../config/env";

@Injectable()
export class TwilioService {
  private twilio: Twilio;
  constructor() {
    this.twilio = new Twilio(
      Environment.TWILIO_ACCOUNT_SID,
      Environment.TWILIO_AUTH_TOKEN
    );
  }

  public async sendSMS(to: string, message: string) {
    return this.twilio.messages.create({
      to,
      from: Environment.TWILIO_PHONE_NUMBER,
      body: message
    })
  }

  public generateAuthCode() {
    let authCode = '';
    for (let i = 0; i < 6; i++) {
      authCode += Math.floor(Math.random() * 10);
    }
    return authCode;
  }

  public isValidPhoneNumber(phoneNumber: string) {
    return new Promise((resolve) => {
      this.twilio.lookups.phoneNumbers(phoneNumber).fetch({
        type: ['carrier']
      }, (error, response) => {
        if (error)
          console.log("@Error: ", error);
        resolve(!!response?.carrier);
      })
    });
  }
};
import { Injectable } from "@nestjs/common";
import { createTransport, Transporter } from 'nodemailer';
import Environment from "../../config/env";

@Injectable()
export class EmailService {
  private transporter: Transporter;
  constructor() {
    this.transporter = createTransport({
      host: Environment.SMTP_HOST,
      port: Environment.SMTP_PORT,
      secure: false,
      auth: {
        user: Environment.SMTP_USERNAME,
        pass: Environment.SMTP_PASSWORD
      }
    });
  }

  public async sendEmail(to: string, subject: string, body: string) {
    const result = await this.transporter.sendMail({
      from: Environment.SMTP_USERNAME,
      to,
      subject,
      text: body
    });
    return result;
  }

  public generateAuthCode() {
    let authCode = '';
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-=';
    for (let i = 0; i < 24; i++) {
      authCode += characters[Math.floor(Math.random() * characters.length)];
    }
    return authCode;
  }
};
import { ApiProperty } from "@nestjs/swagger";

export class SendSMSMessageDto {
  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  smsMessage: string;
};
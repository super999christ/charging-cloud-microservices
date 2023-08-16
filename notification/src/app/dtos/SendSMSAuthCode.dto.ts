import { ApiProperty } from "@nestjs/swagger";

export class SendSMSAuthCodeDto {
  @ApiProperty()
  phoneNumber: string;
};
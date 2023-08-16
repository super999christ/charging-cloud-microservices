import { ApiProperty } from "@nestjs/swagger";

export class ValidateSMSAuthCodeDto {
  @ApiProperty()
  notificationId: number;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  authCode: string;
};
import { ApiProperty } from "@nestjs/swagger";

export class ValidateEmailAuthCodeDto {
  @ApiProperty()
  notificationId: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  authCode: string;
};
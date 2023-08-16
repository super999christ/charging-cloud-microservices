import { ApiProperty } from "@nestjs/swagger";

export class SendEmailAuthCodeDto {
  @ApiProperty()
  email: string;

  @ApiProperty({ nullable: true })
  paramString?: string;
};
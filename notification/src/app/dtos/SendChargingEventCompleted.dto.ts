import { ApiProperty } from "@nestjs/swagger";

export class SendChargingEventCompletedDto {
  @ApiProperty()
  eventId: number;

  @ApiProperty()
  type: 'email' | 'sms';

  @ApiProperty({ nullable: true })
  email?: string;

  @ApiProperty({ nullable: true })
  phoneNumber?: string;
};
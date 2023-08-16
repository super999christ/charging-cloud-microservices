import { ApiProperty } from "@nestjs/swagger";

export class SaveCCDto {
  @ApiProperty()
  cardNumber: string;

  @ApiProperty()
  expYear: number;

  @ApiProperty()
  expMonth: number;

  @ApiProperty()
  cvc: string;

  @ApiProperty()
  customerEmail: string;

  @ApiProperty()
  customerName: string;
};
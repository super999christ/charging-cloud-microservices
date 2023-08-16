import { ApiProperty } from "@nestjs/swagger";

export class UpdateCCDto {
  @ApiProperty()
  pmId: string;

  @ApiProperty()
  cardNumber: string;

  @ApiProperty()
  expYear: number;

  @ApiProperty()
  expMonth: number;

  @ApiProperty()
  cvc: string;
};
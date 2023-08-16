import { ApiProperty } from "@nestjs/swagger";

export class CompleteCCDto {
  @ApiProperty()
  pmId: string;

  @ApiProperty()
  cusId: string;

  @ApiProperty()
  amount: number;
};
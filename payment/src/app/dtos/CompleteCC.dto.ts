import { ApiProperty } from "@nestjs/swagger";

export class CompleteCCDto {
  @ApiProperty()
  amount: number;
}

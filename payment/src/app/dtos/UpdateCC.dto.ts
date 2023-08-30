import { ApiProperty } from "@nestjs/swagger";

export class UpdateCCDto {
  @ApiProperty()
  pmId: string;
}

import { ApiProperty } from "@nestjs/swagger";

export class ValidateTokenDto {
  @ApiProperty()
  token: string;
};
import { ApiProperty } from "@nestjs/swagger";

export class RequestUserTokenDto {
  @ApiProperty()
  userId: string;
}

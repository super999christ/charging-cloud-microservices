import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import Environment from "../config/env";
import { AuthenticationService } from "./authentication.service";

@Module({
  imports: [
    JwtModule.register({
      secret: Environment.TOKEN_SECRET_KEY,
      signOptions: { expiresIn: '1h' }
    })
  ],
  providers: [AuthenticationService],
  exports: [AuthenticationService]
})
export class AuthenticationModule {

}
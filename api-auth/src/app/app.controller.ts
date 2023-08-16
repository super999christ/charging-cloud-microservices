import { Body, Controller, Get, Inject, Post, Response } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { Response as IResponse } from "express";
import { AuthenticationService } from "../authentication/authentication.service";
import { AppDictionary } from "../config/env";
import { RequestUserTokenDto } from "./dtos/RequestUserToken.dto";
import { ValidateTokenDto } from "./dtos/ValidateToken.dto";

@Controller()
export class AppController {
  @Inject(AuthenticationService)
  private authService: AuthenticationService;

  @Post("request-user-token")
  @ApiOperation({ summary: "Generates User JWT" })
  public async requestUserToken(
    @Body() requestUserTokenDto: RequestUserTokenDto
  ) {
    const app = AppDictionary.find((app) => app.appName === "charging");
    if (app) {
      const token = this.authService.generateToken({
        ...app,
        userId: requestUserTokenDto.userId,
      });
      return { token };
    } else {
      return { token: null };
    }
  }

  @Post("validate-user-token")
  @ApiOperation({ summary: "Validates User JWT" })
  public async validateUserToken(@Body() validateTokenDto: ValidateTokenDto) {
    const payload = this.authService.validateToken(validateTokenDto.token);
    if (payload) {
      const app = AppDictionary.find(
        (app) =>
          app.appName === payload.appName && app.appCode === payload.appCode
      );
      if (app) {
        return { isValid: true, ...payload };
      }
    }
    return { isValid: false };
  }

  @Get("healthz")
  public async healthz(@Response() response: IResponse) {
    return response.sendStatus(200);
  }
}

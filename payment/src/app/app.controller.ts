import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Request,
  Response,
} from "@nestjs/common";
import { Response as IResponse, Request as IRequest } from "express";
import { PaymentService } from "../services/payment/payment.service";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { UpdateCCDto } from "./dtos/UpdateCC.dto";
import { CompleteCCDto } from "./dtos/CompleteCC.dto";
import axios from "axios";
import Environment from "../config/env";
import { PinoLogger, InjectPinoLogger } from "nestjs-pino";

@Controller()
export class AppController {
  @InjectPinoLogger(AppController.name)
  private readonly logger: PinoLogger;

  @Inject()
  paymentService: PaymentService;

  @Get("get-cc")
  @ApiOperation({ summary: "Fetch credit card information" })
  @ApiBearerAuth()
  public async getCC(@Request() req: IRequest) {
    const userId = (req as any).userId;
    const customer = await this.paymentService.getCustomer(userId);

    if (!customer)
      throw new BadRequestException(
        "You do not have a linked stripe customer id"
      );

    const paymentMethods = await this.paymentService.getPaymentMethods(
      customer.id
    );

    if (paymentMethods.data.length <= 0)
      throw new BadRequestException(
        "You do not have any attached payment methods."
      );

    const paymentMethod = paymentMethods.data[0];

    return {
      last4: paymentMethod.card?.last4,
      expMonth: paymentMethod.card?.exp_month,
      expYear: paymentMethod.card?.exp_year,
      postalCode: paymentMethod.billing_details.address?.postal_code,
    };
  }

  @Put("update-cc")
  @ApiOperation({ summary: "Update credit card information" })
  @ApiBearerAuth()
  public async updateCC(
    @Body() body: UpdateCCDto,
    @Request() req: IRequest,
    @Response() response: IResponse
  ) {
    const userId = (req as any).userId;
    const customer = await this.paymentService.getCustomer(userId);

    if (!customer)
      throw new BadRequestException(
        "You must create a customer before updating the payment method."
      );

    const paymentMethods = await this.paymentService.getPaymentMethods(
      customer.id
    );

    paymentMethods.data.forEach((pm) =>
      this.paymentService.detachPaymentMethod(pm.id)
    );

    await this.paymentService.attachPaymentMethodToCustomer(
      body.pmId,
      customer.id
    );

    response.status(204).send();
  }

  @Post("complete-charge")
  @ApiOperation({ summary: "Complete charging" })
  @ApiBearerAuth()
  public async completeCharge(
    @Body() body: CompleteCCDto,
    @Request() req: IRequest
  ) {
    const userId = (req as any).userId;
    const customer = await this.paymentService.getCustomer(userId);
    if (!customer)
      throw new BadRequestException(
        "You do not have a linked stripe customer id"
      );
    const paymentMethods = await this.paymentService.getPaymentMethods(
      customer.id
    );
    if (paymentMethods.data.length <= 0)
      throw new BadRequestException(
        "You do not have an attached payment method"
      );

    const charge = await this.paymentService.chargePayment(
      paymentMethods.data[0].id,
      customer.id,
      body.amount
    );
    return charge;
  }

  @Post("customer")
  @ApiOperation({ summary: "Creates a stripe customer" })
  @ApiBearerAuth()
  public async customer(@Request() req: IRequest, @Response() res: IResponse) {
    const userId = (req as any).userId;
    const {
      data: { firstName, lastName, email },
    } = await getUserProfile(req);
    await this.paymentService.createCustomer(
      email,
      `${firstName} ${lastName}`,
      userId
    );

    return res.status(204).send();
  }

  @Get("healthz")
  public async healthz(@Response() res: IResponse) {
    return res.sendStatus(200);
  }
}

function getUserProfile(req: IRequest) {
  return axios.get(`${Environment.SERVICE_USER_MANAGEMENT_URL}/profile`, {
    headers: { Authorization: (req as any).headers.authorization },
  });
}

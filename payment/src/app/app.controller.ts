import {
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
  public async getCC(@Request() req: IRequest, @Response() res: IResponse) {
    try {
      const userId = (req as any).userId;
      const customer = await this.paymentService.getCustomer(userId);

      if (!customer)
        return res
          .status(400)
          .send("You do not have a linked stripe customer id");

      const paymentMethods = await this.paymentService.getPaymentMethods(
        customer.id
      );

      const paymentMethod = paymentMethods.data[0];

      res.send({
        last4: paymentMethod.card?.last4,
        expMonth: paymentMethod.card?.exp_month,
        expYear: paymentMethod.card?.exp_year,
        postalCode: paymentMethod.billing_details.address?.postal_code,
      });
    } catch (err) {
      this.logger.error(JSON.stringify(err));
      res.sendStatus(400);
    }
  }

  @Put("update-cc")
  @ApiOperation({ summary: "Update credit card information" })
  @ApiBearerAuth()
  public async updateCC(
    @Body() body: UpdateCCDto,
    @Request() req: IRequest,
    @Response() response: IResponse
  ) {
    try {
      const userId = (req as any).userId;
      const customer = await this.paymentService.getCustomer(userId);

      if (!customer)
        return response
          .status(400)
          .send(
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
    } catch (err) {
      this.logger.error(JSON.stringify(err));
      response.status(400).send("Failed to update credit card");
    }
  }

  @Post("complete-charge")
  @ApiOperation({ summary: "Complete charging" })
  @ApiBearerAuth()
  public async completeCharge(
    @Body() body: CompleteCCDto,
    @Request() req: IRequest,
    @Response() res: IResponse
  ) {
    try {
      const userId = (req as any).userId;
      const customer = await this.paymentService.getCustomer(userId);

      if (!customer)
        return res
          .status(400)
          .send("You do not have a linked stripe customer id");

      const paymentMethods = await this.paymentService.getPaymentMethods(
        customer.id
      );

      if (paymentMethods.data.length <= 0)
        return res
          .status(400)
          .send("You do not have an attached payment method");

      const charge = await this.paymentService.chargePayment(
        paymentMethods.data[0].id,
        customer.id,
        body.amount
      );
      res.send(charge);
    } catch (err) {
      this.logger.error(JSON.stringify(err));
      res.status(400).send("Failed to process payment");
    }
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

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
import axios, { AxiosResponse } from "axios";
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
    const {
      data: { stripeCustomerId, stripePaymentMethodId },
    } = await getUserProfile(req);

    if (!stripeCustomerId)
      throw new BadRequestException(
        "You do not have a linked stripe customer id"
      );

    if (!stripePaymentMethodId)
      throw new BadRequestException(
        "You do not have any attached payment method."
      );

    const paymentMethod = await this.paymentService.getPaymentMethod(
      stripeCustomerId,
      stripePaymentMethodId
    );

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
    const {
      data: { stripeCustomerId, stripePaymentMethodId },
    } = await getUserProfile(req);

    if (!stripeCustomerId)
      throw new BadRequestException(
        "You must create a customer before updating the payment method."
      );

    if (stripePaymentMethodId)
      await this.paymentService.detachPaymentMethod(stripePaymentMethodId);

    await this.paymentService.attachPaymentMethodToCustomer(
      body.pmId,
      stripeCustomerId
    );

    await updateUserProfile(req, { stripePaymentMethodId: body.pmId });

    response.sendStatus(204);
  }

  @Post("complete-charge")
  @ApiOperation({ summary: "Complete charging" })
  @ApiBearerAuth()
  public async completeCharge(
    @Body() body: CompleteCCDto,
    @Request() req: IRequest
  ) {
    const {
      data: { stripeCustomerId, stripePaymentMethodId },
    } = await getUserProfile(req);

    if (!stripeCustomerId)
      throw new BadRequestException(
        "You do not have a linked stripe customer id"
      );

    if (!stripePaymentMethodId)
      throw new BadRequestException(
        "You do not have any attached payment method."
      );

    const charge = await this.paymentService.chargePayment(
      stripePaymentMethodId,
      stripeCustomerId,
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
      data: { firstName, lastName, email, stripeCustomerId },
    } = await getUserProfile(req);

    if (!stripeCustomerId) {
      const customer = await this.paymentService.createCustomer(
        email,
        `${firstName} ${lastName}`,
        userId
      );

      await updateUserProfile(req, { stripeCustomerId: customer.id });
    }

    return res.sendStatus(204);
  }

  @Get("healthz")
  public async healthz(@Response() res: IResponse) {
    return res.sendStatus(200);
  }
}

type User = {
  firstName: string;
  lastName: string;
  email: string;
  stripeCustomerId: string;
  stripePaymentMethodId: string;
};

function getUserProfile(req: IRequest): Promise<AxiosResponse<User>> {
  return axios.get(`${Environment.SERVICE_USER_MANAGEMENT_URL}/profile`, {
    headers: { Authorization: (req as any).headers.authorization },
  });
}

function updateUserProfile(req: IRequest, user: Partial<User>) {
  return axios.put(
    `${Environment.SERVICE_USER_MANAGEMENT_URL}/profile`,
    {
      ...user,
    },
    { headers: { Authorization: (req as any).headers.authorization } }
  );
}

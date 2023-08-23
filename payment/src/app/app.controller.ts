import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Query,
  Response,
  Logger
} from "@nestjs/common";
import { Response as IResponse } from "express";
import { PaymentService } from "../services/payment/payment.service";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { SaveCCDto } from "./dtos/SaveCC.dto";
import { UpdateCCDto } from "./dtos/UpdateCC.dto";
import { CompleteCCDto } from "./dtos/CompleteCC.dto";

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  @Inject()
  paymentService: PaymentService;

  @Post("save-cc")
  @ApiOperation({ summary: "Save credit card information" })
  @ApiBearerAuth()
  public async saveCC(
    @Body() params: SaveCCDto,
    @Response() response: IResponse
  ) {
    const { cardNumber, expYear, expMonth, cvc, customerEmail, customerName } =
      params;
    try {
      const stripePaymentMethod = await this.paymentService.createPaymentMethod(
        cardNumber,
        expYear,
        expMonth,
        cvc
      );
      const stripeCustomer = await this.paymentService.createCustomer(
        customerEmail,
        customerName
      );
      await this.paymentService.attachPaymentMethodToCustomer(
        stripePaymentMethod.id,
        stripeCustomer.id
      );
      response.send({
        customerId: stripeCustomer.id,
        pmId: stripePaymentMethod.id,
      });
    } catch (err) {
      console.error("@Error: ", err);
      response.sendStatus(400);
    }
  }

  @Get("get-cc")
  @ApiOperation({ summary: "Fetch credit card information" })
  @ApiBearerAuth()
  public async getCC(
    @Query("pmId") pmId: string,
    @Response() response: IResponse
  ) {
    try {
      const stripePaymentMethod = await this.paymentService.getPaymentMethod(
        pmId
      );
      response.send({
        last4: stripePaymentMethod.card?.last4,
        expMonth: stripePaymentMethod.card?.exp_month,
        expYear: stripePaymentMethod.card?.exp_year,
      });
    } catch (err) {
      console.error("@Error: ", err);
      response.sendStatus(400);
    }
  }

  @Put("update-cc")
  @ApiOperation({ summary: "Update credit card information" })
  @ApiBearerAuth()
  public async updateCC(
    @Body() params: UpdateCCDto,
    @Response() response: IResponse
  ) {
    const { cardNumber, expYear, expMonth, cvc, pmId } = params;
    try {
      const newStripePaymentMethod =
        await this.paymentService.updatePaymentMethod(
          pmId,
          cardNumber,
          expYear,
          expMonth,
          cvc
        );
      const customerId = newStripePaymentMethod.customer as string;
      response.send({
        pmId: newStripePaymentMethod.id,
        customerId,
      });
    } catch (err) {
      console.error("@Error: ", err);
      response.status(400).send("Credit card information is incorrect");
    }
  }

  @Post("complete-charge")
  @ApiOperation({ summary: "Complete charging" })
  @ApiBearerAuth()
  public async completeCharge(
    @Body() params: CompleteCCDto,
    @Response() response: IResponse
  ) {
    const { amount, pmId, cusId } = params;
    try {
      const charge = await this.paymentService.chargePayment(
        pmId,
        cusId,
        amount
      );
      response.send(charge);
    } catch (err) {
      console.error("@Error: ", err);
      response.sendStatus(500);
    }
  }

  @Get("healthz")
  public async healthz(@Response() response: IResponse) {
    this.logger.error({"propertyA": "this is a property", "error": "This is a really long error message asdfhaskjfha jkdhfa skjdfha sjkdfhasljkdfhasjkdfh asjdkfh askjdhfa skjdfhaslkjdfhasljkf haj fhasdfj hasldkfj hasldfhasdfkjahsd flhasdfj kahsdfljahsdfljashdfljkashdf ljashdfla jshdflajs hdflajkshdflkjasdhflasjdhf alsjdhalskdfhaslk dhsjklfd hasldkfj hasdljk fhsladf hasldkjfhasljkdfhasldjkfhasljkdf hasljkdfhasljdhf alskjhdfls jkhf."});
    return response.sendStatus(200);
  }
}

import { Injectable } from "@nestjs/common";
import Stripe from "stripe";
import Environment from "../../config/env";

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(Environment.STRIPE_API_KEY, {
      apiVersion: "2022-11-15",
    });
  }

  public async createCustomer(
    customerEmail: string,
    customerName: string,
    userId: string
  ) {
    const result = await this.getCustomerByUserId(userId);

    if (result.total_count === 1) return result.data[0];

    if (0 < result.total_count!)
      throw Error(`More than 1 customer exists for userId ${userId}`);

    return this.stripe.customers.create(
      {
        email: customerEmail,
        name: customerName,
        metadata: {
          userId,
        },
      },
      { idempotencyKey: userId }
    );
  }

  public async detachPaymentMethod(pmId: string) {
    return this.stripe.paymentMethods.detach(pmId);
  }

  public async attachPaymentMethodToCustomer(pmId: string, customerId: string) {
    return this.stripe.paymentMethods.attach(pmId, {
      customer: customerId,
    });
  }

  public async getCustomer(userId: string) {
    const result = await this.getCustomerByUserId(userId);

    if (result.total_count === 0) return null;

    if (1 < result.total_count!)
      throw Error(`More than 1 customer exists for userId ${userId}`);

    return result.data[0];
  }

  public async getPaymentMethods(customerId: string) {
    return this.stripe.customers.listPaymentMethods(customerId);
  }

  public async getPaymentMethod(customerId: string, pmId: string) {
    return this.stripe.customers.retrievePaymentMethod(customerId, pmId);
  }

  public async chargePayment(pmId: string, cusId: string, amount: number, idempotencyKey?: string) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      payment_method: pmId,
      customer: cusId,
      amount: Math.round(Math.max(amount * 100, 50)),
      currency: "USD",
      confirm: true,
      description: "NXU charge",
    }, {
      idempotencyKey
    });
    return paymentIntent;
  }

  private async getCustomerByUserId(userId: string) {
    return this.stripe.customers.search({
      query: `metadata[\"userId\"]: \"${userId}\"`,
    });
  }
}

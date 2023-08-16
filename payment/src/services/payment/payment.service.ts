import { Injectable } from "@nestjs/common";
import Stripe from "stripe";
import Environment from "../../config/env";

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(Environment.STRIPE_API_KEY,{
			apiVersion: '2022-11-15'
		});
  }

	public async createCustomer(customerEmail: string, customerName: string) {
		return this.stripe.customers.create({
			email: customerEmail,
			name: customerName
		});
	}

	public async createPaymentMethod(cardNumber: string, expYear: number, expMonth: number, cvc: string) {
		return this.stripe.paymentMethods.create({
			type: 'card',
			card: {
				number: cardNumber,
				exp_year: expYear,
				exp_month: expMonth,
				cvc: cvc
			}
		});
	}

	public async updatePaymentMethod(pmId: string, cardNumber: string, expYear: number, expMonth: number, cvc: string) {
		const oldStripePaymentMethod = await this.getPaymentMethod(pmId);
		const stripePaymentMethod = await this.createPaymentMethod(cardNumber, expYear, expMonth, cvc);
		await this.stripe.paymentMethods.detach(pmId);
		await this.attachPaymentMethodToCustomer(stripePaymentMethod.id, oldStripePaymentMethod.customer as string);
		return { ...stripePaymentMethod, customer: oldStripePaymentMethod.customer };
	}

	public async updateCustomer(customerId: string, customerName: string, customerEmail: string) {
		return this.stripe.customers.update(customerId, {
			name: customerName,
			email: customerEmail
		});
	}

	public async attachPaymentMethodToCustomer(pmId: string, customerId: string) {
		return this.stripe.paymentMethods.attach(pmId, {
			customer: customerId
		});
	}

	public async getPaymentMethod(pmId: string) {
		return this.stripe.paymentMethods.retrieve(pmId);
	}

	public async chargePayment(pmId: string, cusId: string, amount: number) {
		const paymentIntent = await this.stripe.paymentIntents.create({
			payment_method: pmId,
			customer: cusId,
			amount: Math.round(Math.max(amount * 100, 50)),
			currency: 'USD',
			confirm: true,
			description: 'NXU charge'
		});
		return paymentIntent;
	}
}
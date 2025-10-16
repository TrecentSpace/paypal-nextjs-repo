import { PayPalConfig, SubscriptionPlan } from "@/types/paypal";

const isProd = process.env.NODE_ENV === "production";

export const PAYPAL_CONFIG: PayPalConfig = {
	clientId: isProd ? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX!,
	currency: process.env.NEXT_PUBLIC_PAYPAL_CURRENCY || "USD",
	environment: isProd ? "production" : "sandbox",
};

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
	{
		id: isProd
			? process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID!
			: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_SANDBOX!,
		name: "Monthly Subscription",
		description: "Access to all features billed monthly",
		price: 10,
		interval: "MONTH",
	},
];
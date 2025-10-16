export interface SubscriptionPlan {
	id: string;
	name: string;
	description: string;
	price: number;
	interval: "MONTH" | "YEAR";
}

export interface PayPalConfig {
	clientId: string;
	currency: string;
	environment: "sandbox" | "production";
}

// PayPal Webhooks

export interface PayPalWebhookEvent<T = any> {
	id: string;
	create_time: string;
	resource_type: string;
	event_type: string;
	summary: string;
	resource: T;
	links: PayPalLink[];
	event_version: string;
	resource_version: string;
}

export interface PayPalLink {
	href: string;
	rel: string;
	method: string;
	encType?: string;
}

/* --------------------
   SUBSCRIPTIONS
-------------------- */
export interface PayPalSubscription {
	id: string; // subscription ID (e.g., I-BW452GLLEP1G)
	plan_id: string;
	status: string;
	start_time: string;
	update_time: string;
	status_update_time?: string;
	create_time: string;
	quantity: string;
	shipping_amount?: {
		currency_code: string;
		value: string;
	};
	auto_renewal?: boolean;

	subscriber: {
		name: {
			given_name: string;
			surname: string;
		};
		email_address: string;
		payer_id?: string;
		shipping_address?: {
			name: {
				full_name: string;
			};
			address: {
				address_line_1: string;
				address_line_2?: string;
				admin_area_2: string;
				admin_area_1: string;
				postal_code: string;
				country_code: string;
			};
		};
	};

	billing_info: {
		outstanding_balance?: {
			currency_code: string;
			value: string;
		};
		cycle_executions?: Array<{
			tenure_type: "TRIAL" | "REGULAR";
			sequence: number;
			cycles_completed: number;
			cycles_remaining: number;
			current_pricing_scheme_version: number;
		}>;
		last_payment?: {
			amount: {
				currency_code: string;
				value: string;
			};
			time: string;
		};
		last_failed_payment?: {
			amount: {
				currency_code: string;
				value: string;
			};
			time: string;
			reason_code?: string;
			next_payment_retry_date?: string;
		};
		next_billing_time?: string;
		final_payment_time?: string;
		failed_payments_count?: number;
	};

	links: PayPalLink[];
}

/* --------------------
   PAYMENTS
-------------------- */
export interface PayPalPayment {
	id: string;
	create_time: string;
	resource_type: "sale";
	event_type: "PAYMENT.SALE.COMPLETED";
	summary: string;
	resource: SaleResource;
	status: "SUCCESS" | "FAILURE" | "PENDING";
	transmissions: Transmission[];
	links: Link[];
	event_version: string;
}

export interface SaleResource {
	amount: {
		total: string;
		currency: string;
		details: {
			subtotal: string;
		};
	};
	payment_mode: "INSTANT_TRANSFER" | string;
	create_time: string;
	transaction_fee: {
		currency: string;
		value: string;
	};
	receipt_id: string;
	billing_agreement_id: string;
	update_time: string;
	soft_descriptor: string;
	protection_eligibility: "INELIGIBLE" | "ELIGIBLE" | "PARTIALLY_ELIGIBLE";
	links: Link[];
	id: string;
	state:
		| "completed"
		| "pending"
		| "refunded"
		| "partially_refunded"
		| "denied";
	invoice_number: string;
}

interface Transmission {
	webhook_url: string;
	http_status: number;
	reason_phrase: string;
	response_headers: Record<string, string>;
	transmission_id: string;
	status: "SUCCESS" | "FAILURE" | "PENDING";
	timestamp: string;
}

interface Link {
	href: string;
	rel: "self" | "refund" | "resend";
	method: "GET" | "POST";
	encType?: "application/json";
}
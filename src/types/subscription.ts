export type Subscription = {
	id?: string;
	user_id?: string;
	paypal_subscription_id?: string;
	plan_id?: string;
	status?: string;
	payer_email?: string;
	billing_cycle_count?: number;
	trial?: boolean;
	trial_end_date?: string;
	start_time?: string;
	next_billing_time?: string;
	failed_payment_status?: 'active' | 'failed';
	raw?: string;
	created_at?: string;
	updated_at?: string;
};

export type Usage = {
	id?: string;
	user_id: string;
	period_start: string;
	threads_count?: number;
	premium_edits_count?: number;
	created_at?: string;
	updated_at?: string;
};
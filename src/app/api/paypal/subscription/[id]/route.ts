import { NextRequest, NextResponse } from "next/server";
import { PAYPAL_API, getPayPalAccessToken } from "@/lib/paypal";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const subscriptionId = (await params).id;
		const accessToken = await getPayPalAccessToken();

		const response = await fetch(
			`${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${accessToken}`,
				},
			}
		);

		const data = await response.json();

		if (!response.ok) {
			return NextResponse.json(
				{
					error: "Failed to fetch subscription details",
					details: data,
				},
				{ status: response.status }
			);
		}

		// Extract relevant information
		const subscriptionDetails = {
			id: data.id,
			status: data.status,
			planId: data.plan_id,
			startTime: data.start_time,
			quantity: data.quantity,
			subscriber: data.subscriber,
			billingInfo: {
				outstandingBalance: data.billing_info?.outstanding_balance,
				nextBillingTime: data.billing_info?.next_billing_time,
				failedPayments: data.billing_info?.failed_payments_count,
				lastPayment: data.billing_info?.last_payment,
				cyclesCompleted:
					data.billing_info?.cycle_executions?.[0]?.cycles_completed,
			},
			shippingAddress: data.shipping_address,
			createTime: data.create_time,
			updateTime: data.update_time,
		};

		return NextResponse.json(subscriptionDetails);
	} catch (error) {
		console.error("Error fetching subscription details:", error);
		return NextResponse.json(
			{ error: "Failed to fetch subscription details" },
			{ status: 500 }
		);
	}
}
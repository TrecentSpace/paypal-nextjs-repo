import { NextRequest, NextResponse } from "next/server";
import { UpdateSubscription, UpdateSubscriptionStatus, UpdateSubscriptionCycle, UpdateFailedPaymentStatus } from "@/lib/subscriptions";
import {
    PayPalWebhookEvent,
    PayPalSubscription,
    SaleResource,
} from "@/types/paypal";
import { PAYPAL_API, getPayPalAccessToken } from "@/lib/paypal";

const WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID!;

async function verifySignature(rawBody: string, headers: Headers) {
    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
        `${PAYPAL_API}/v1/notifications/verify-webhook-signature`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                auth_algo: headers.get("paypal-auth-algo"),
                cert_url: headers.get("paypal-cert-url"),
                transmission_id: headers.get("paypal-transmission-id"),
                transmission_sig: headers.get("paypal-transmission-sig"),
                transmission_time: headers.get("paypal-transmission-time"),
                webhook_id: WEBHOOK_ID,
                webhook_event: JSON.parse(rawBody),
            }),
        }
    );

    if (!response.ok) {
        console.error("❌ PayPal verify call failed:", await response.text());
        return false;
    }

    const result = await response.json();
    return result.verification_status === "SUCCESS";
}

export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text(); // ✅ Needed for PayPal signature
        const isSignatureValid = await verifySignature(rawBody, req.headers);

        const event: PayPalWebhookEvent = JSON.parse(rawBody);

        if (!isSignatureValid) {
            console.warn("❌ Invalid signature, ignoring:", event.id);
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 400 }
            );
        }

        // 🎯 Handle subscription lifecycle
        switch (event.event_type) {
			case "BILLING.SUBSCRIPTION.CREATED":
				// @ts-ignore because sub is within an isolated scope
				const sub_C = event.resource as PayPalSubscription;

				console.log("Subscription created:", event.resource.id);
				// TODO: Insert subscription into DB (status=pending/created)

				break;

			case "BILLING.SUBSCRIPTION.ACTIVATED":
				const sub_A = event.resource as PayPalSubscription;

				console.log("Subscription activated:", event.resource.id);
				// TODO: Mark subscription as active in DB
				await UpdateSubscription(
					{
						paypal_subscription_id: sub_A.id, // necessary for identifying the subscription
						plan_id: sub_A.plan_id,
						status: sub_A.status,
						payer_email: sub_A.subscriber.email_address,
						start_time: sub_A.start_time,
						next_billing_time:
							sub_A.billing_info.next_billing_time!,
					}
				);
				break;

			case "BILLING.SUBSCRIPTION.CANCELLED": {
				// block to scope declarations
				const sub = event.resource as PayPalSubscription;

				console.log("Subscription cancelled:", event.resource.id);
				// TODO: Mark subscription as cancelled in DB
				await UpdateSubscriptionStatus(
					{
						paypal_subscription_id: sub.id, // necessary for identifying the subscription
						status: sub.status,
					}
				);

				// Delete usage records for cascade cleanup
				// TODO: Implement usage cleanup based on your database

				break;
			}

			case "BILLING.SUBSCRIPTION.EXPIRED": {
				// block to scope declarations
				const sub = event.resource as PayPalSubscription;

				console.log("Subscription expired:", event.resource.id);
				// TODO: Update subscription status in DB
				await UpdateSubscriptionStatus(
					{
						paypal_subscription_id: sub.id, // necessary for identifying the subscription
						status: sub.status,
					}
				);

				// Delete usage records for cascade cleanup
				// TODO: Implement usage cleanup based on your database

				break;
			}

			case "PAYMENT.SALE.COMPLETED": {

				const payment = event.resource as SaleResource;
				console.log(payment)
				console.log("Payment received:", event.resource.id);

				// 1. Update billing cycle
				await UpdateSubscriptionCycle(payment);

				// 2. Find which user this subscription belongs to
				// TODO: Implement user lookup based on your database
				// const { data: subscription, error } = await db
				// 	.select("user_id, start_time")
				// 	.from("subscriptions")
				// 	.where("paypal_subscription_id", payment.billing_agreement_id)
				// 	.single();

				// if (subscription?.user_id) {
				// 	// 3. Reset usage for the correct user
				// 	await ResetPeriodUsage(subscription.user_id, subscription.start_time);
				// }

				break;
			}

			// Handles BILLING.SUBSCRIPTION.PAYMENT.FAILED: Flags failure in DB for UI badge; resets on success via UpdateSubscriptionCycle
			case "BILLING.SUBSCRIPTION.PAYMENT.FAILED": {
				const sub = event.resource as PayPalSubscription;
				console.log(`Payment failed for ${sub.id}: ${sub.billing_info.last_failed_payment?.reason_code || 'Unknown'}. Retry: ${sub.billing_info.last_failed_payment?.next_payment_retry_date || 'N/A'}`);

				await UpdateFailedPaymentStatus(sub.id);

				// Sync other fields if changed
				await UpdateSubscription({
					paypal_subscription_id: sub.id,
					status: sub.status,
					next_billing_time: sub.billing_info.next_billing_time,
					payer_email: sub.subscriber.email_address,
					start_time: sub.start_time,
				});

				break;
			}

			default:
				console.log("Unhandled event:", event.event_type);
		}

        return new NextResponse("OK", { status: 200 });
    } catch (err: any) {
        console.error("Webhook error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
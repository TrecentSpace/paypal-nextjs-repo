import { NextResponse } from "next/server";
import { PAYPAL_API, getPayPalAccessToken } from "@/lib/paypal";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ action: string }> }
) {
    const { subscriptionId } = await req.json();
    const token = await getPayPalAccessToken();

    let url = "";
    let method = "POST";
    let body: any = {};

    const { action } = await params;
    switch (action) {
        case "cancel":
            url = `${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}/cancel`;
            body = { reason: "User requested cancellation" };
            break;
        case "reactivate":
            url = `${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}/activate`;
            body = { reason: "User requested reactivation" };
            break;
        case "change":
            url = `${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}/revise`;
            body = {
				plan_id: process.env.NEXT_PUBLIC_PAYPAL_YEARLY_PLAN_ID_PROD, // ⚠️ Change to prod
			};
            break
        default:
            return NextResponse.json(
                { error: "Invalid action" },
                { status: 400 }
            );
    }
    const res = await fetch(url, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorText = await res.text();
        return NextResponse.json({ error: errorText }, { status: res.status });
    }

    return NextResponse.json({ success: true });
}
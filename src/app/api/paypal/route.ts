import { NextResponse } from "next/server";
import { getPayPalAccessToken } from "@/lib/paypal";

export async function GET() {
	try {
		const accessToken = await getPayPalAccessToken();
		return NextResponse.json({ accessToken });
	} catch (error) {
		console.error("Error in PayPal API route:", error);
		return NextResponse.json(
			{ error: "Failed to get PayPal access token" },
			{ status: 500 }
		);
	}
}
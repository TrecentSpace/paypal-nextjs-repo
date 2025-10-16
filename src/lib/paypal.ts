const isProd = process.env.NODE_ENV === "production";

const clientId = isProd ? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID! : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX!;
const clientSecret = isProd ? process.env.PAYPAL_CLIENT_SECRET! : process.env.PAYPAL_CLIENT_SECRET_SANDBOX!;

export const PAYPAL_API = isProd
	? "https://api-m.paypal.com"
	: "https://api-m.sandbox.paypal.com";

export async function getPayPalAccessToken() {
	try {
		const response = await fetch(
			`${PAYPAL_API}/v1/oauth2/token`,
			{
				method: "POST",
				headers: {
					Accept: "application/json",
					"Accept-Language": "en_US",
					Authorization: `Basic ${Buffer.from(
						`${clientId}:${clientSecret}`
					).toString("base64")}`,
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: "grant_type=client_credentials",
			}
		);

		const data = await response.json();
		return data.access_token;
	} catch (error) {
		console.error("Error getting PayPal access token:", error);
		throw error;
	}
}

const clientId_Sandbox = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX!;
const clientSecret_Sandbox = process.env.PAYPAL_CLIENT_SECRET_SANDBOX!;


export async function getPayPalAccessToken_Sandbox() {
	try {
		const response = await fetch(
			`https://api-m.sandbox.paypal.com/v1/oauth2/token`,
			{
				method: "POST",
				headers: {
					Accept: "application/json",
					"Accept-Language": "en_US",
					Authorization: `Basic ${Buffer.from(
						`${clientId_Sandbox}:${clientSecret_Sandbox}`
					).toString("base64")}`,
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: "grant_type=client_credentials",
			}
		);

		const data = await response.json();
		return data.access_token;
	} catch (error) {
		console.error("Error getting PayPal access token:", error);
		throw error;
	}
}
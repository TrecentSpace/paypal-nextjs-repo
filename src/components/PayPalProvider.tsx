"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { PAYPAL_CONFIG } from "@/config/paypal";
import { ReactNode } from "react";

export default function PayPalProvider({ children }: { children: ReactNode }) {
	return (
		<PayPalScriptProvider
			options={{
				clientId: PAYPAL_CONFIG.clientId,
				currency: PAYPAL_CONFIG.currency,
				vault: true,
				intent: "subscription",
				components: "buttons",
			}}
		>
			{children}
		</PayPalScriptProvider>
	);
}
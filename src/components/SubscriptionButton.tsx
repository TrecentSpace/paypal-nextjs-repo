"use client";

import { PayPalButtons } from "@paypal/react-paypal-js";
import { SubscriptionPlan } from "@/types/paypal";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { StoreSubscription } from "@/lib/subscriptions";

interface SubscriptionButtonProps {
	plan: SubscriptionPlan;
	userId?: string; // Optional: pass user ID if you have authentication
}

export default function SubscriptionButton({ plan, userId }: SubscriptionButtonProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const getPayPalAccessToken = async () => {
		try {
			const response = await fetch("/api/paypal");
			const data = await response.json();
			if (!response.ok) throw new Error(data.error);
			return data.accessToken;
		} catch (error) {
			console.error("Error getting PayPal access token:", error);
			throw error;
		}
	};

	return (
		<PayPalButtons
			createSubscription={async (data, actions) => {
				setIsLoading(true);
				try {
					const token = await getPayPalAccessToken();
					return actions.subscription.create({
						plan_id: plan.id,
						application_context: {
							brand_name: "Your App Name",
							locale: "en-US",
							shipping_preference: "NO_SHIPPING",
							user_action: "SUBSCRIBE_NOW",
							return_url: `${window.location.origin}/success`,
							cancel_url: `${window.location.origin}`,
						},
					});
				} catch (error) {
					console.error("Subscription creation error:", error);
					throw error;
				} finally {
					setIsLoading(false);
				}
			}}
			onApprove={async (data, actions) => {
				try {
					toast.success("Subscription successful!");
					if (userId) {
						await StoreSubscription({
							user_id: userId,
							paypal_subscription_id: data.subscriptionID!
						});
					}
					router.push(
						`/success?subscriptionId=${data.subscriptionID}`
					);
				} catch (error) {
					console.error("Error processing subscription:", error);
					toast.error("Error processing subscription");
				}
			}}
			onError={(err) => {
				console.error("PayPal error details:", {
					message: err.message,
					stack: err.stack,
					details: err,
				});
				toast.error("An error occurred with your subscription");
			}}
			onCancel={() => {
				toast.error("Subscription cancelled");
			}}
			style={{
				layout: "vertical",
				color: "gold",
				shape: "rect",
				label: "subscribe",
				borderRadius: 15,
			}}
			disabled={isLoading}
		/>
	);
}
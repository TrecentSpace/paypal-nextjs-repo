"use client";

import { GetSubscription } from "@/lib/subscriptions";
import { Subscription } from "@/types/subscription";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function BillingComponent({ userId }: { userId: string }) {
	const [subscriptionData, setSubscriptionData] =
		useState<Subscription | null>(null);
	const [loading, setLoading] = useState(false);

	// Fetch subscription from DB
	useEffect(() => {
		const fetchSubscription = async () => {
			const subscription = await GetSubscription(userId);
			setSubscriptionData(subscription);
		};
		fetchSubscription();
	}, [userId]);

	// Call PayPal actions via API
	const handleAction = async (action: string) => {
		if (!subscriptionData) return;
		setLoading(true);
		try {
			const res = await fetch(`/api/paypal/actions/${action}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					subscriptionId: subscriptionData.paypal_subscription_id,
				}),
			});
			const data = await res.json();
			if (!res.ok) throw new Error(data.error || "Failed");

			toast.success(`Subscription ${action} successful`);

			// Refresh subscription info
			const updated = await GetSubscription(userId);
			setSubscriptionData(updated);
		} catch (err: any) {
			console.error(err);
			toast.error(err.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	};

	const formatDate = (iso?: string) => {
		if (!iso) return null;
		try {
			return new Date(iso).toLocaleDateString(undefined, {
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		} catch {
			return iso;
		}
	};

	// All users are now Pro tier - no free plan
	const isPro = true;

	// Determine if user is in trial stage or active stage
	// Trial stage: trial column is TRUE
	// Active stage: trial column is FALSE (trial ended and user has paid)
	const trialValue = subscriptionData?.trial;
	const isTrialStage = trialValue === true || String(trialValue).toLowerCase() === "true";
	const isActiveStage = trialValue === false || String(trialValue).toLowerCase() === "false";

	// Check if trial has expired
	const trialEndDate = subscriptionData?.trial_end_date ? new Date(subscriptionData.trial_end_date) : null;
	const now = new Date();
	const isTrialExpired = trialEndDate && now > trialEndDate && isTrialStage;

	return (
		<>
			{loading ? (
				<div className="h-12 w-full max-w-3xl bg-gray-700/40 rounded-md animate-pulse" />
			) : (
				<div className="w-full max-w-md lg:max-w-3xl">
					<div className="bg-[#0b0f12] border border-gray-800 rounded-xl p-6 shadow-sm">
						<div className="flex flex-col lg:flex-row items-start gap-5">
							{/* Icon */}
							<div className="flex-shrink-0 w-full md:w-auto flex justify-center">
								<div className="h-16 w-16 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-md">
									<svg
										width="28"
										height="28"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										aria-hidden
									>
										<path
											d="M3 7l4 2 3-4 3 4 3-4 4 2v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z"
											fill="white"
										/>
									</svg>
								</div>
							</div>

							{/* Content */}
							<div className="flex-1 flex flex-col w-full justify-between">
								<div className="flex flex-col items-center lg:items-start">
									<div className="flex items-center gap-3">
											<h3 className="text-2xl font-semibold text-white">
												Pro Plan
											</h3>

											{isTrialExpired ? (
												<span className="text-xs font-medium bg-red-700/80 text-red-100 px-3 py-1 rounded-full uppercase">
													Trial Expired
												</span>
											) : isTrialStage ? (
												<span className="text-xs font-medium bg-blue-700/80 text-blue-100 px-3 py-1 rounded-full uppercase">
													Trial Phase
												</span>
											) : (
												<span className="text-xs font-medium bg-emerald-700/80 text-emerald-100 px-3 py-1 rounded-full uppercase">
													Active
												</span>
											)}
										</div>

									<p className="mt-3 text-sm text-gray-300">
										{isTrialExpired ? (
											<>
												Your trial has expired. Please add payment information to continue using Pro features.
											</>
										) : isTrialStage ? (
											<>
												You're currently in your trial period. Enjoy full access to all features at no cost.
												{trialEndDate && (
													<>
														{" "}
														Your trial ends on{" "}
														<span className="font-medium text-white">
															{formatDate(trialEndDate.toISOString())}
														</span>
														.
													</>
												)}
											</>
										) : (
											<>
												Active subscription since{" "}
												<span className="font-medium text-white">
													{formatDate(
														subscriptionData?.start_time ??
															subscriptionData?.created_at
													) ?? "—"}
												</span>
												{subscriptionData?.next_billing_time && (
													<>
														{" "}
														· Next billing cycle:{" "}
														<span className="font-medium text-white">
															{formatDate(
																subscriptionData.next_billing_time
															)}
														</span>
													</>
												)}
											</>
										)}
									</p>

									{/* Status badges */}
									<div className="mt-4 flex flex-col lg:flex-row items-center gap-3">
										{isTrialExpired ? (
											<span className="inline-flex items-center gap-2 rounded-full bg-red-600/80 text-white text-xs px-3 py-1">
												<span className="h-2 w-2 rounded-full bg-white/90 block animate-pulse" />
												Trial Expired
											</span>
										) : isTrialStage ? (
											<span className="inline-flex items-center gap-2 rounded-full bg-blue-600/80 text-white text-xs px-3 py-1">
												<span className="h-2 w-2 rounded-full bg-white/90 block animate-pulse" />
												Trial Active
											</span>
										) : subscriptionData?.status === "ACTIVE" ? (
											<span className="inline-flex items-center gap-2 rounded-full bg-green-600/80 text-white text-xs px-3 py-1">
												<span className="h-2 w-2 rounded-full bg-white/90 block" />
												Subscription Active
											</span>
										) : subscriptionData?.status === "CANCELLED" ? (
											<span className="inline-flex items-center gap-2 rounded-full bg-rose-600/80 text-white text-xs px-3 py-1">
												Cancelled
											</span>
										) : (
											<span className="inline-flex items-center gap-2 rounded-full bg-gray-700 text-gray-200 text-xs px-3 py-1">
												{subscriptionData?.status ?? "—"}
											</span>
										)}

										{/* optional small info */}
										{subscriptionData?.payer_email && (
											<span className="text-xs text-gray-400 ml-2">
												{subscriptionData.payer_email}
											</span>
										)}

										{/* New: Badge for failed payment status */}
										{subscriptionData?.failed_payment_status === 'failed' && (
											<span className="inline-flex items-center gap-2 rounded-full bg-red-600/80 text-white text-xs px-3 py-1">
												<span className="h-2 w-2 rounded-full bg-white/90 block animate-pulse" />
												Payment Failed – There was a problem with your payment method
											</span>
										)}
									</div>
								</div>

								{/* Actions */}
								<div className="mt-5 flex flex-col lg:flex-row items-center gap-3">
									{isTrialExpired ? (
										<Button className="rounded-full px-5 py-2.5 text-sm bg-red-600 hover:bg-red-700 text-white cursor-pointer">
											Add Payment Method
										</Button>
									) : isTrialStage ? (
										<Button className="rounded-full px-6 py-3 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-lg shadow-gray-900/20 border-2 border-blue-500/50 hover:shadow-xl hover:shadow-gray-900/30 hover:border-blue-400 transition-all duration-200 hover:scale-[1.02]">
											Upgrade to Monthly Billing
										</Button>
									) : (
										/* show Cancel only if ACTIVE and not in trial stage */
										subscriptionData?.status === "ACTIVE" && !isTrialStage && (
											<Button
												variant="ghost"
												disabled={loading}
												onClick={() =>
													handleAction("cancel")
												}
												className="rounded-full px-5 py-2.5 text-sm text-white border border-gray-700 hover:bg-gray-800 hover:text-white cursor-pointer"
											>
												Cancel Plan
											</Button>
										)
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Payment Info – only show if Pro */}
					{isPro && (
						<div className="mt-3 text-sm text-gray-800">
							Payment ID:
							<span className="ml-2 text-gray-700">
								{subscriptionData?.paypal_subscription_id ??
									"—"}
							</span>
							{subscriptionData?.billing_cycle_count !==
								undefined && (
								<span className="ml-3 text-gray-800">
									· {subscriptionData.billing_cycle_count === 1 ? "Cycle: Trial" : `Cycles: ${subscriptionData.billing_cycle_count - 1}`}
								</span>
							)}
						</div>
					)}
				</div>
			)}
		</>
	);
}
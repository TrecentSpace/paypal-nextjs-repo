import Link from "next/link";
import { PayPalProvider, SubscriptionButton, SUBSCRIPTION_PLANS } from "@/index";

export default function Home() {
  return (
    <PayPalProvider>
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 sm:p-10">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            PayPal Next.js Template Demo
          </h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400 text-base sm:text-lg">
            Complete PayPal subscription integration for Next.js applications
          </p>

          <div className="mt-12 flex justify-center">
            <div className="w-full max-w-sm">
              <div className="p-8 rounded-2xl border-2 border-blue-500 text-white shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 animate-gradient-move bg-[length:200%_200%] rounded-xl"></div>
                <div className="absolute inset-0 bg-black/20 dark:bg-black/30 rounded-2xl"></div>

                <div className="relative z-10">
                  <h5 className="mb-2 text-2xl font-semibold">
                    Pro Plan
                  </h5>
                  <p className="mb-6 opacity-90">
                    Full access to all features
                  </p>
                  <div className="flex items-end justify-center">
                    <span className="text-4xl font-bold">
                      $10
                    </span>
                    <span className="ml-1 text-lg opacity-90">
                      /month
                    </span>
                  </div>
                  <ul className="space-y-3 my-8 text-sm sm:text-base">
                    <li className="flex items-center">
                      ✔{" "}
                      <span className="ml-3">
                        100 threads per month
                      </span>
                    </li>
                    <li className="flex items-center">
                      ✔{" "}
                      <span className="ml-3">
                        Premium features
                      </span>
                    </li>
                    <li className="flex items-center">
                      ✔{" "}
                      <span className="ml-3">
                        Email support
                      </span>
                    </li>
                  </ul>

                  <div className="flex justify-center">
                    <SubscriptionButton
                      plan={SUBSCRIPTION_PLANS[0]}
                      userId="demo-user-123"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Features
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Complete Integration</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Full PayPal subscription lifecycle with webhooks, trials, and billing management.
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">TypeScript Support</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Fully typed with comprehensive interfaces for PayPal APIs and subscriptions.
                </p>
              </div>
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2">Database Agnostic</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Works with any database - examples included for Supabase, Prisma, and more.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Link
              href="/billing"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              View Billing Demo →
            </Link>
          </div>
        </div>
      </main>
    </PayPalProvider>
  );
}

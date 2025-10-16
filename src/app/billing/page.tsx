import { BillingComponent } from "@/index";

export default function BillingPage() {
  // In a real app, get the user ID from your authentication system
  const userId = "demo-user-123";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Billing & Subscription Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your subscription, view billing history, and update payment methods.
          </p>
        </div>

        <BillingComponent userId={userId} />

        <div className="mt-12 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Usage Tracking Demo
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Threads this month</span>
                  <span className="font-semibold">0 / 100</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Premium edits this month</span>
                  <span className="font-semibold">0 / 100</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Webhook Events
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <div>
                  <span className="font-medium">BILLING.SUBSCRIPTION.ACTIVATED</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Subscription successfully activated</p>
                </div>
                <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900 px-2 py-1 rounded">
                  Processed
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <div>
                  <span className="font-medium">PAYMENT.SALE.COMPLETED</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Monthly payment received</p>
                </div>
                <span className="text-xs text-blue-600 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                  Processed
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
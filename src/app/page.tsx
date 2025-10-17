import { SUBSCRIPTION_PLANS } from '@/config/paypal';
import SubscriptionButton from '@/components/SubscriptionButton';
import PayPalProvider from '@/components/PayPalProvider';

export default function Home() {
  return (
    <PayPalProvider>
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Choose Your Subscription Plan</h1>
          <div className="mt-12 flex justify-center">
            <div className="w-full max-w-sm">
              <div
                className="rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow relative backdrop-blur-sm dark:backdrop-blur-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 50%)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <h2 className="text-xl font-semibold mb-2">{SUBSCRIPTION_PLANS[0].name}</h2>
                <p className="text-gray-600 mb-4">{SUBSCRIPTION_PLANS[0].description}</p>
                <p className="text-2xl font-bold mb-6">
                  ${SUBSCRIPTION_PLANS[0].price}/{SUBSCRIPTION_PLANS[0].interval === 'MONTH' ? 'month' : 'year'}
                </p>
                <SubscriptionButton plan={SUBSCRIPTION_PLANS[0]} userId="demo-user-123" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </PayPalProvider>
  );
}

// Main exports for the PayPal Next.js Template

// Types
export type {
  SubscriptionPlan,
  PayPalConfig,
  PayPalWebhookEvent,
  PayPalSubscription,
  PayPalPayment,
} from './types/paypal';
export type { Subscription, Usage } from './types/subscription';

// Configuration
export { PAYPAL_CONFIG, SUBSCRIPTION_PLANS } from './config/paypal';

// PayPal API utilities
export {
  getPayPalAccessToken,
  getPayPalAccessToken_Sandbox,
  PAYPAL_API,
} from './lib/paypal';

// Database functions (template - implement with your database)
export {
  GetSubscription,
  StoreSubscription,
  StartTrialSubscription,
  UpdateSubscription,
  UpdateSubscriptionStatus,
  UpdateSubscriptionCycle,
  UpdateFailedPaymentStatus,
} from './lib/subscriptions';

export {
  CreateUsage,
  GetUserUsage,
  UpdateUser_ThreadCount,
  UpdateUser_PremiumEdits,
  GetOrCreateUserUsage,
  IncrementUserThreadCount,
  IncrementUserPremiumEdits,
  ResetPeriodUsage,
} from './lib/usage';

// React Components
export { default as PayPalProvider } from './components/PayPalProvider';
export { default as SubscriptionButton } from './components/SubscriptionButton';
export { default as BillingComponent } from './components/BillingComponent';

// Utilities
export { cn } from './lib/utils';
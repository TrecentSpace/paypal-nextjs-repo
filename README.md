# PayPal Next.js Template

A complete PayPal subscription integration template for Next.js + TypeScript applications. This template provides everything you need to integrate PayPal subscriptions into your SaaS application, including trial periods, webhooks, billing management, and usage tracking.

## Features

- ✅ **Complete PayPal Integration**: Subscriptions, payments, and webhooks
- ✅ **Trial Management**: Built-in trial periods with automatic conversion
- ✅ **Webhook Handling**: Secure webhook verification and event processing
- ✅ **Billing Management**: Subscription status, cancellation, reactivation
- ✅ **Usage Tracking**: Monthly usage limits and billing cycles
- ✅ **TypeScript Support**: Full type safety throughout
- ✅ **Modular Architecture**: Easy to customize and extend
- ✅ **Sandbox & Production**: Environment-based configuration

## Quick Start

### 1. Clone and Install

```bash
npx create-next-app@latest my-app --template paypal-nextjs-template
cd my-app
npm install
```

### 2. Environment Setup

Create a `.env.local` file with your PayPal credentials:

```env
# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX=your_sandbox_client_id
PAYPAL_CLIENT_SECRET_SANDBOX=your_sandbox_client_secret

# PayPal Plans
NEXT_PUBLIC_PAYPAL_PLAN_ID=your_production_plan_id
NEXT_PUBLIC_PAYPAL_PLAN_ID_SANDBOX=your_sandbox_plan_id

# Webhook Configuration
PAYPAL_WEBHOOK_ID=your_production_webhook_id
PAYPAL_WEBHOOK_ID_SANDBOX=your_sandbox_webhook_id

# Optional: Currency and other settings
NEXT_PUBLIC_PAYPAL_CURRENCY=USD
```

### 3. Database Setup

This template is database-agnostic. Choose your preferred database and implement the functions in:

- `src/lib/subscriptions.ts` - Subscription management
- `src/lib/usage.ts` - Usage tracking

Example implementations for popular databases:

- **Supabase**: See `examples/supabase/`
- **Prisma + PostgreSQL**: See `examples/prisma/`
- **MongoDB**: See `examples/mongodb/`

### 4. PayPal Setup

1. **Create PayPal App**: Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. **Create Subscription Plans**: Set up your billing plans
3. **Configure Webhooks**: Point to `/api/paypal/webhook`
4. **Update Environment Variables**: Add your credentials

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see the demo.

## Project Structure

```
src/
├── app/
│   ├── api/paypal/           # PayPal API routes
│   │   ├── route.ts          # Access token endpoint
│   │   ├── actions/          # Subscription actions (cancel, reactivate)
│   │   ├── subscription/     # Subscription details
│   │   └── webhook/          # Webhook handler
│   ├── billing/              # Billing page (example)
│   ├── success/              # Success page
│   └── upgrade/              # Upgrade page
├── components/
│   ├── PayPalProvider.tsx    # PayPal context provider
│   ├── SubscriptionButton.tsx # PayPal subscription button
│   ├── BillingComponent.tsx  # Billing management UI
│   └── ui/                   # UI components
├── config/
│   └── paypal.ts             # PayPal configuration
├── lib/
│   ├── paypal.ts             # PayPal API utilities
│   ├── subscriptions.ts      # Subscription management (implement)
│   ├── usage.ts              # Usage tracking (implement)
│   └── utils.ts              # Utility functions
└── types/
    ├── paypal.ts             # PayPal type definitions
    └── subscription.ts       # Subscription types
```

## Usage Examples

### Basic Subscription Button

```tsx
import { PayPalProvider } from '@/components/PayPalProvider';
import { SubscriptionButton } from '@/components/SubscriptionButton';
import { SUBSCRIPTION_PLANS } from '@/config/paypal';

export default function PricingPage() {
  return (
    <PayPalProvider>
      <div className="pricing-cards">
        {SUBSCRIPTION_PLANS.map(plan => (
          <div key={plan.id} className="plan-card">
            <h3>{plan.name}</h3>
            <p>${plan.price}/{plan.interval.toLowerCase()}</p>
            <SubscriptionButton plan={plan} userId={userId} />
          </div>
        ))}
      </div>
    </PayPalProvider>
  );
}
```

### Billing Management

```tsx
import { BillingComponent } from '@/components/BillingComponent';

export default function AccountPage() {
  return (
    <div>
      <h1>Account Settings</h1>
      <BillingComponent userId={userId} />
    </div>
  );
}
```

### Usage Tracking

```tsx
import { IncrementUserThreadCount } from '@/lib/usage';

// When user performs an action
await IncrementUserThreadCount(userId);
```

## API Routes

### GET `/api/paypal`
Returns PayPal access token for client-side operations.

### POST `/api/paypal/actions/[action]`
Manage subscriptions:
- `cancel`: Cancel a subscription
- `reactivate`: Reactivate a cancelled subscription
- `change`: Change subscription plan

### GET `/api/paypal/subscription/[id]`
Get detailed subscription information.

### POST `/api/paypal/webhook`
Handles PayPal webhook events:
- `BILLING.SUBSCRIPTION.CREATED`
- `BILLING.SUBSCRIPTION.ACTIVATED`
- `BILLING.SUBSCRIPTION.CANCELLED`
- `BILLING.SUBSCRIPTION.EXPIRED`
- `PAYMENT.SALE.COMPLETED`
- `BILLING.SUBSCRIPTION.PAYMENT.FAILED`

## Webhook Events

The webhook handler processes these events:

1. **Subscription Created**: Logs new subscription creation
2. **Subscription Activated**: Updates subscription status to active
3. **Subscription Cancelled**: Marks subscription as cancelled and cleans up usage
4. **Subscription Expired**: Updates status and cleans up usage
5. **Payment Completed**: Updates billing cycle and resets usage
6. **Payment Failed**: Flags failed payment status

## Customization

### Adding New Subscription Plans

Edit `src/config/paypal.ts`:

```typescript
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID!,
    name: "Pro Plan",
    description: "Full access to all features",
    price: 29,
    interval: "MONTH",
  },
  // Add more plans...
];
```

### Custom Database Implementation

Replace the template functions in `src/lib/subscriptions.ts` and `src/lib/usage.ts` with your database operations.

### Custom UI Components

Modify the components in `src/components/` to match your design system.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Production PayPal client ID | Yes |
| `PAYPAL_CLIENT_SECRET` | Production PayPal secret | Yes |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX` | Sandbox PayPal client ID | Yes |
| `PAYPAL_CLIENT_SECRET_SANDBOX` | Sandbox PayPal secret | Yes |
| `NEXT_PUBLIC_PAYPAL_PLAN_ID` | Production subscription plan ID | Yes |
| `NEXT_PUBLIC_PAYPAL_PLAN_ID_SANDBOX` | Sandbox subscription plan ID | Yes |
| `PAYPAL_WEBHOOK_ID` | Production webhook ID | Yes |
| `PAYPAL_WEBHOOK_ID_SANDBOX` | Sandbox webhook ID | Yes |
| `NEXT_PUBLIC_PAYPAL_CURRENCY` | Currency code (default: USD) | No |

## PayPal Setup Guide

### 1. Create PayPal Business Account
1. Go to [paypal.com](https://www.paypal.com/business)
2. Sign up for a Business account
3. Verify your account

### 2. Create PayPal App
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Create a new app
3. Note down Client ID and Secret

### 3. Create Subscription Plans
1. In your PayPal dashboard, go to Products & Services
2. Create a subscription product
3. Add pricing plans

### 4. Configure Webhooks
1. In your app settings, add webhook URL: `https://yourdomain.com/api/paypal/webhook`
2. Subscribe to these events:
   - `BILLING.SUBSCRIPTION.*`
   - `PAYMENT.SALE.COMPLETED`

## Testing

### Sandbox Testing
1. Use sandbox credentials in your environment
2. Test with PayPal sandbox accounts
3. Use test card numbers for payments

### Webhook Testing
1. Use tools like ngrok to expose local webhook endpoint
2. Use PayPal's webhook simulator
3. Test all webhook events

## Deployment

### Environment Variables
Make sure all environment variables are set in your deployment platform.

### Webhook URL
Update your PayPal app's webhook URL to point to your production domain.

### Database Migration
Run any database migrations required for your chosen database.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Create an issue on GitHub
- Check the examples directory for implementation references
- Review PayPal's official documentation

## Changelog

### v1.0.0
- Initial release
- Complete PayPal subscription integration
- Trial management
- Webhook handling
- Usage tracking
- TypeScript support

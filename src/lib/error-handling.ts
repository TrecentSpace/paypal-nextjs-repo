// Error handling utilities for PayPal integration

export class PayPalError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'PayPalError';
  }
}

export class DatabaseError extends Error {
  constructor(
    message: string,
    public operation?: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class WebhookError extends Error {
  constructor(
    message: string,
    public eventType?: string,
    public eventId?: string
  ) {
    super(message);
    this.name = 'WebhookError';
  }
}

// Error logging utility
export function logError(error: Error, context?: Record<string, any>) {
  const timestamp = new Date().toISOString();
  const errorInfo = {
    timestamp,
    name: error.name,
    message: error.message,
    stack: error.stack,
    context,
  };

  // In production, you might want to send this to a logging service
  console.error('PayPal Integration Error:', errorInfo);

  // You can extend this to send to services like Sentry, LogRocket, etc.
  // Example: Sentry.captureException(error, { extra: context });
}

// Safe async function wrapper
export async function safeAsync<T>(
  fn: () => Promise<T>,
  errorMessage = 'An unexpected error occurred',
  context?: Record<string, any>
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    logError(error as Error, context);
    return null;
  }
}

// PayPal API error handler
export function handlePayPalApiError(response: Response, operation: string) {
  if (!response.ok) {
    throw new PayPalError(
      `PayPal API ${operation} failed: ${response.status} ${response.statusText}`,
      `PAYPAL_API_${response.status}`,
      { operation, status: response.status, statusText: response.statusText }
    );
  }
}

// Database operation wrapper
export async function withDatabaseErrorHandling<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    throw new DatabaseError(
      `Database operation '${operationName}' failed`,
      operationName,
      error
    );
  }
}

// Webhook event validation
export function validateWebhookEvent(event: any): boolean {
  const requiredFields = ['id', 'create_time', 'event_type', 'resource'];

  for (const field of requiredFields) {
    if (!event[field]) {
      logError(new WebhookError(`Missing required field: ${field}`, event.event_type, event.id));
      return false;
    }
  }

  return true;
}

// Retry utility for transient failures
export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000,
  backoff = 2
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        break;
      }

      // Don't retry certain types of errors
      if (error instanceof PayPalError && (error as PayPalError).code?.includes('401')) {
        // Authentication errors shouldn't be retried
        break;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= backoff;
    }
  }

  throw lastError!;
}

// Usage validation helper
export function validateUsageLimits(
  currentUsage: { threads_count: number; premium_edits_count: number },
  limits: { maxThreads: number; maxPremiumEdits: number }
): { valid: boolean; exceeded: string[] } {
  const exceeded: string[] = [];

  if (currentUsage.threads_count >= limits.maxThreads) {
    exceeded.push('threads');
  }

  if (currentUsage.premium_edits_count >= limits.maxPremiumEdits) {
    exceeded.push('premium_edits');
  }

  return {
    valid: exceeded.length === 0,
    exceeded
  };
}

// Subscription status validation
export function validateSubscriptionStatus(status: string): boolean {
  const validStatuses = [
    'APPROVAL_PENDING',
    'APPROVED',
    'ACTIVE',
    'SUSPENDED',
    'CANCELLED',
    'EXPIRED'
  ];

  return validStatuses.includes(status);
}

// Environment validation
export function validateEnvironment(): { valid: boolean; missing: string[] } {
  const required = [
    'NEXT_PUBLIC_PAYPAL_CLIENT_ID',
    'PAYPAL_CLIENT_SECRET',
    'NEXT_PUBLIC_PAYPAL_PLAN_ID',
    'PAYPAL_WEBHOOK_ID'
  ];

  const missing = required.filter(key => !process.env[key]);

  return {
    valid: missing.length === 0,
    missing
  };
}
-- PayPal Next.js Template - Supabase Schema
-- Run this in your Supabase SQL editor or migration tool

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  paypal_subscription_id VARCHAR(50) UNIQUE NOT NULL,
  plan_id VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'APPROVAL_PENDING',
  payer_email VARCHAR(255),
  billing_cycle_count INTEGER DEFAULT 0,
  start_time TIMESTAMPTZ,
  next_billing_time TIMESTAMPTZ,
  trial BOOLEAN DEFAULT FALSE,
  trial_end_date TIMESTAMPTZ,
  failed_payment_status VARCHAR(10) DEFAULT 'active',
  raw JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage table
CREATE TABLE usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  period_start DATE NOT NULL,
  threads_count INTEGER DEFAULT 0,
  premium_edits_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, period_start)
);

-- Indexes for performance
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_paypal_id ON subscriptions(paypal_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_usage_user_period ON usage(user_id, period_start);
CREATE INDEX idx_usage_period_start ON usage(period_start);

-- Row Level Security (RLS) policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage ENABLE ROW LEVEL SECURITY;

-- Policies for subscriptions (adjust based on your auth system)
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Policies for usage
CREATE POLICY "Users can view their own usage" ON usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own usage" ON usage
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_updated_at
  BEFORE UPDATE ON usage
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle subscription cycle updates (transaction-safe)
CREATE OR REPLACE FUNCTION update_subscription_cycle(
  paypal_subscription_id_param VARCHAR(50),
  payment_amount DECIMAL,
  payment_time TIMESTAMPTZ
)
RETURNS subscriptions AS $$
DECLARE
  subscription_record subscriptions;
BEGIN
  -- Update subscription cycle count and billing info
  UPDATE subscriptions
  SET
    billing_cycle_count = billing_cycle_count + 1,
    next_billing_time = payment_time + INTERVAL '1 month',
    failed_payment_status = 'active',
    updated_at = NOW()
  WHERE paypal_subscription_id = paypal_subscription_id_param
  RETURNING * INTO subscription_record;

  -- Reset usage for the user if subscription exists
  IF subscription_record.id IS NOT NULL THEN
    -- Get period start from subscription start time
    INSERT INTO usage (user_id, period_start, threads_count, premium_edits_count)
    VALUES (
      subscription_record.user_id,
      DATE(payment_time),
      0,
      0
    )
    ON CONFLICT (user_id, period_start)
    DO UPDATE SET
      threads_count = 0,
      premium_edits_count = 0,
      updated_at = NOW();
  END IF;

  RETURN subscription_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
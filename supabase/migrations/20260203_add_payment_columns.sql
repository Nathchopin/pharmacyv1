-- Migration to add payment tracking columns to consultations table

ALTER TABLE consultations
ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid';

-- Add an index for faster lookups by session ID
CREATE INDEX IF NOT EXISTS idx_consultations_stripe_session_id ON consultations(stripe_session_id);

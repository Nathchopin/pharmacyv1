-- Up Migration
BEGIN;

-- Drop existing check constraint
ALTER TABLE consultations DROP CONSTRAINT IF EXISTS consultations_status_check;

-- Add new check constraint with 'active' and 'canceled' included
ALTER TABLE consultations 
ADD CONSTRAINT consultations_status_check 
CHECK (status IN (
    'pending_review', 
    'in_progress', 
    'approved', 
    'rejected', 
    'completed',
    'booked', 
    'inventory_check', 
    'active_subscription',
    'active',
    'canceled'
));

COMMIT;

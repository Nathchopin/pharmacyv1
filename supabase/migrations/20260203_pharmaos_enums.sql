-- Up Migration
BEGIN;

-- 1. Try to drop existing check constraints if they exist (naming convention assumption)
ALTER TABLE consultations DROP CONSTRAINT IF EXISTS consultations_status_check;
ALTER TABLE consultations DROP CONSTRAINT IF EXISTS consultations_service_type_check;

-- 2. Add new check constraints with expanded values
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
    'active_subscription'
));

ALTER TABLE consultations 
ADD CONSTRAINT consultations_service_type_check 
CHECK (service_type IN (
    'general', 
    'weight_loss', 
    'hair_loss', 
    'blood_test', 
    'travel_clinic', 
    'pharmacy_first', 
    'shop'
));

COMMIT;

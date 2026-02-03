-- Up Migration
BEGIN;

-- Update consultation_status enum
ALTER TYPE consultation_status ADD VALUE IF NOT EXISTS 'booked';
ALTER TYPE consultation_status ADD VALUE IF NOT EXISTS 'inventory_check';
ALTER TYPE consultation_status ADD VALUE IF NOT EXISTS 'active_subscription';

-- Update service_type enum
ALTER TYPE service_type ADD VALUE IF NOT EXISTS 'weight_loss';
ALTER TYPE service_type ADD VALUE IF NOT EXISTS 'hair_loss';
ALTER TYPE service_type ADD VALUE IF NOT EXISTS 'blood_test';
ALTER TYPE service_type ADD VALUE IF NOT EXISTS 'travel_clinic';
ALTER TYPE service_type ADD VALUE IF NOT EXISTS 'pharmacy_first';
ALTER TYPE service_type ADD VALUE IF NOT EXISTS 'shop';

COMMIT;

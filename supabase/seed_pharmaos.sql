
-- Insert dummy data for Weight Loss
-- We select an existing User ID from auth.users to avoid Foreign Key errors
INSERT INTO consultations (id, patient_id, service_type, status, patient_data, created_at)
SELECT gen_random_uuid(), id, 'weight_loss', 'pending_review', '{"bmi": 32, "medication": "Wegovy"}', NOW()
FROM auth.users LIMIT 1;

INSERT INTO consultations (id, patient_id, service_type, status, patient_data, created_at)
SELECT gen_random_uuid(), id, 'weight_loss', 'in_progress', '{"bmi": 29, "medication": "Mounjaro"}', NOW() - INTERVAL '1 day'
FROM auth.users LIMIT 1;

-- Insert dummy data for Hair Loss
INSERT INTO consultations (id, patient_id, service_type, status, patient_data, created_at)
SELECT gen_random_uuid(), id, 'hair_loss', 'pending_review', '{"treatment": "Finasteride"}', NOW() - INTERVAL '2 hours'
FROM auth.users LIMIT 1;

-- Insert dummy data for Blood Tests (as appointments)
INSERT INTO consultations (id, patient_id, service_type, status, patient_data, created_at)
SELECT gen_random_uuid(), id, 'blood_test', 'booked', '{"test": "Full Blood Count"}', NOW() - INTERVAL '3 days'
FROM auth.users LIMIT 1;

-- Insert dummy data for Pharmacy First
INSERT INTO consultations (id, patient_id, service_type, status, patient_data, created_at)
SELECT gen_random_uuid(), id, 'pharmacy_first', 'pending_review', '{"condition": "UTI"}', NOW() - INTERVAL '4 hours'
FROM auth.users LIMIT 1;

-- Insert dummy data for Travel Clinic
INSERT INTO consultations (id, patient_id, service_type, status, patient_data, created_at)
SELECT gen_random_uuid(), id, 'travel_clinic', 'inventory_check', '{"destination": "Thailand"}', NOW() - INTERVAL '1 hour'
FROM auth.users LIMIT 1;

-- Insert dummy data for Shop
INSERT INTO consultations (id, patient_id, service_type, status, patient_data, created_at)
SELECT gen_random_uuid(), id, 'shop', 'active_subscription', '{"item": "Vitamin D"}', NOW() - INTERVAL '5 days'
FROM auth.users LIMIT 1;

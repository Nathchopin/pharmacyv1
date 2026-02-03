-- Add role column to profiles table for dual-user system (patient/pharmacist)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'patient' 
CHECK (role IN ('patient', 'pharmacist', 'admin'));

-- Create index for faster role-based queries
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Update RLS policies to allow pharmacists to view patient data
CREATE POLICY "Pharmacists can view all patient profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('pharmacist', 'admin')
  )
);

-- Create pharmacist_queue table for clinical task management
CREATE TABLE IF NOT EXISTS public.pharmacist_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  task_type TEXT NOT NULL CHECK (task_type IN ('prescription_review', 'lab_review', 'consultation', 'follow_up')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'approved', 'rejected', 'completed')),
  assigned_to UUID REFERENCES auth.users(id), -- pharmacist user_id
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  notes TEXT, -- pharmacist notes
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on pharmacist_queue
ALTER TABLE public.pharmacist_queue ENABLE ROW LEVEL SECURITY;

-- Pharmacists can view all queue items
CREATE POLICY "Pharmacists can view queue"
ON public.pharmacist_queue
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('pharmacist', 'admin')
  )
);

-- Pharmacists can insert queue items
CREATE POLICY "Pharmacists can create queue items"
ON public.pharmacist_queue
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('pharmacist', 'admin')
  )
);

-- Pharmacists can update queue items
CREATE POLICY "Pharmacists can update queue"
ON public.pharmacist_queue
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('pharmacist', 'admin')
  )
);

-- Pharmacists can delete queue items
CREATE POLICY "Pharmacists can delete queue items"
ON public.pharmacist_queue
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND p.role IN ('pharmacist', 'admin')
  )
);

-- Create trigger to auto-update timestamps
CREATE TRIGGER update_pharmacist_queue_updated_at
BEFORE UPDATE ON public.pharmacist_queue
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_pharmacist_queue_status ON public.pharmacist_queue(status);
CREATE INDEX IF NOT EXISTS idx_pharmacist_queue_assigned_to ON public.pharmacist_queue(assigned_to);
CREATE INDEX IF NOT EXISTS idx_pharmacist_queue_patient_id ON public.pharmacist_queue(patient_id);
CREATE INDEX IF NOT EXISTS idx_pharmacist_queue_created_at ON public.pharmacist_queue(created_at DESC);

-- Add missing columns to affiliate_payouts table
ALTER TABLE public.affiliate_payouts 
ADD COLUMN IF NOT EXISTS bank_name TEXT,
ADD COLUMN IF NOT EXISTS account_number TEXT,
ADD COLUMN IF NOT EXISTS account_holder TEXT,
ADD COLUMN IF NOT EXISTS requested_amount NUMERIC NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS processed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Update existing records to have requested_amount = amount
UPDATE public.affiliate_payouts 
SET requested_amount = amount 
WHERE requested_amount = 0;
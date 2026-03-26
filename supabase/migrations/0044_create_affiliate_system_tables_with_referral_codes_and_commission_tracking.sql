-- Create affiliates table to store CTV information
CREATE TABLE public.affiliates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  commission_rate DECIMAL DEFAULT 0.10, -- 10% default
  total_earnings DECIMAL DEFAULT 0,
  total_referrals INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create affiliate_commissions table to track each commission
CREATE TABLE public.affiliate_commissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  commission_amount DECIMAL NOT NULL,
  commission_rate DECIMAL NOT NULL,
  order_amount DECIMAL NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Create affiliate_payouts table for payment history
CREATE TABLE public.affiliate_payouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  payment_method TEXT DEFAULT 'bank_transfer',
  payment_details JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Add referral tracking to orders table
ALTER TABLE public.orders ADD COLUMN referred_by_code TEXT DEFAULT NULL;

-- Enable RLS on all new tables
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for affiliates table
CREATE POLICY "affiliates_select_own" ON public.affiliates 
FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "affiliates_insert_own" ON public.affiliates 
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "affiliates_update_own" ON public.affiliates 
FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for affiliate_commissions table
CREATE POLICY "commissions_select_own" ON public.affiliate_commissions 
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.affiliates 
    WHERE affiliates.id = affiliate_commissions.affiliate_id 
    AND affiliates.user_id = auth.uid()
  )
);

-- RLS Policies for affiliate_payouts table
CREATE POLICY "payouts_select_own" ON public.affiliate_payouts 
FOR SELECT TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.affiliates 
    WHERE affiliates.id = affiliate_payouts.affiliate_id 
    AND affiliates.user_id = auth.uid()
  )
);

-- Admin can see all affiliate data
CREATE POLICY "admin_affiliates_all" ON public.affiliates 
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.subscription_plan = 'admin'
  )
);

CREATE POLICY "admin_commissions_all" ON public.affiliate_commissions 
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.subscription_plan = 'admin'
  )
);

CREATE POLICY "admin_payouts_all" ON public.affiliate_payouts 
FOR ALL TO authenticated USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.subscription_plan = 'admin'
  )
);

-- Create function to generate unique referral codes
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  code TEXT;
  exists_check INTEGER;
BEGIN
  LOOP
    -- Generate code: FL + 6 random uppercase letters/numbers
    code := 'FL' || upper(substring(md5(random()::text) from 1 for 6));
    
    -- Check if code already exists
    SELECT COUNT(*) INTO exists_check 
    FROM public.affiliates 
    WHERE referral_code = code;
    
    -- If unique, exit loop
    IF exists_check = 0 THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$;

-- Create function to automatically calculate and create commissions
CREATE OR REPLACE FUNCTION process_affiliate_commission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  affiliate_record RECORD;
  commission_amount DECIMAL;
BEGIN
  -- Only process when order status changes to 'completed'
  IF NEW.status = 'completed' AND OLD.status != 'completed' AND NEW.referred_by_code IS NOT NULL THEN
    
    -- Find the affiliate by referral code
    SELECT * INTO affiliate_record 
    FROM public.affiliates 
    WHERE referral_code = NEW.referred_by_code 
    AND is_active = true;
    
    IF FOUND THEN
      -- Calculate 10% commission
      commission_amount := NEW.amount * affiliate_record.commission_rate;
      
      -- Create commission record
      INSERT INTO public.affiliate_commissions (
        affiliate_id,
        order_id,
        referred_user_id,
        commission_amount,
        commission_rate,
        order_amount,
        status
      ) VALUES (
        affiliate_record.id,
        NEW.id,
        NEW.user_id,
        commission_amount,
        affiliate_record.commission_rate,
        NEW.amount,
        'pending'
      );
      
      -- Update affiliate totals
      UPDATE public.affiliates 
      SET 
        total_earnings = total_earnings + commission_amount,
        total_referrals = total_referrals + 1,
        updated_at = NOW()
      WHERE id = affiliate_record.id;
      
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically process commissions
DROP TRIGGER IF EXISTS process_affiliate_commission_trigger ON public.orders;
CREATE TRIGGER process_affiliate_commission_trigger
  AFTER UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION process_affiliate_commission();

-- Add updated_at trigger for affiliates table
DROP TRIGGER IF EXISTS update_affiliates_updated_at ON public.affiliates;
CREATE TRIGGER update_affiliates_updated_at
  BEFORE UPDATE ON public.affiliates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
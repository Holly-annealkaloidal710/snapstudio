-- Add subscription tracking columns to profiles
ALTER TABLE public.profiles
ADD COLUMN subscription_starts_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN subscription_expires_at TIMESTAMP WITH TIME ZONE;

-- Create orders table to track transactions
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_type TEXT NOT NULL DEFAULT 'subscription',
  item_id TEXT NOT NULL, -- e.g., 'pro', 'enterprise'
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'VND',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, rejected
  payment_method TEXT,
  payment_id TEXT, -- The VA or account number for matching
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Trigger to update 'updated_at' column on orders
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create notifications table for user alerts
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- e.g., 'payment_success', 'new_feature'
  content TEXT NOT NULL,
  link_to TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies for notifications
CREATE POLICY "Users can manage their own notifications" ON public.notifications FOR ALL TO authenticated USING (auth.uid() = user_id);

-- Function to find a pending order by the prefix of its UUID for webhook matching
CREATE OR REPLACE FUNCTION public.get_pending_order_by_id_prefix(_prefix TEXT)
RETURNS TABLE(id UUID, user_id UUID, status TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT o.id, o.user_id, o.status
  FROM public.orders AS o
  WHERE o.status = 'pending' AND o.id::text LIKE (_prefix || '%');
END;
$$;
-- Update subscription_plan to include admin role
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_subscription_plan_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_subscription_plan_check 
CHECK (subscription_plan IN ('free', 'pro', 'enterprise', 'admin'));

-- Create admin user (replace with your email)
-- You'll need to sign up first, then run this to make yourself admin
-- UPDATE public.profiles SET subscription_plan = 'admin' WHERE email = 'your-admin-email@example.com';
-- Update your-admin@example.com to admin
UPDATE public.profiles 
SET subscription_plan = 'admin'
WHERE email = 'your-admin@example.com';

-- Verify the update
SELECT id, email, subscription_plan, full_name 
FROM public.profiles 
WHERE email = 'your-admin@example.com';
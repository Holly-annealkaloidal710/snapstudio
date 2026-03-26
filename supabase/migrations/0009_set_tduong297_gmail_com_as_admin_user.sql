-- Set admin role for your-admin@example.com
UPDATE public.profiles 
SET subscription_plan = 'admin' 
WHERE email = 'your-admin@example.com';

-- If the user doesn't exist yet, this will be applied when they first sign up
-- The trigger function will create the profile automatically
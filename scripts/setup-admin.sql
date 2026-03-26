-- ============================================
-- SnapStudio: Setup Admin Account
-- ============================================
--
-- Prerequisites:
--   1. Deploy the app and set up Supabase
--   2. Sign up for an account through the app
--   3. Run this SQL in your Supabase SQL Editor
--      (Dashboard -> SQL Editor -> New Query)
--
-- Replace 'your-email@example.com' with the email
-- you used to sign up.
-- ============================================

-- Step 1: Make your account an admin
UPDATE public.profiles
SET subscription_plan = 'admin'
WHERE email = 'your-email@example.com';

-- Step 2: Give yourself starter points to test with
UPDATE public.profiles
SET points_balance = 10000
WHERE email = 'your-email@example.com';

-- Step 3: Verify it worked
SELECT id, email, full_name, subscription_plan, points_balance
FROM public.profiles
WHERE email = 'your-email@example.com';

-- ============================================
-- Expected output:
--   subscription_plan = 'admin'
--   points_balance = 10000
--
-- You now have:
--   - Full admin dashboard access (/admin)
--   - 10,000 points for testing image generation
--   - Access to all features
-- ============================================

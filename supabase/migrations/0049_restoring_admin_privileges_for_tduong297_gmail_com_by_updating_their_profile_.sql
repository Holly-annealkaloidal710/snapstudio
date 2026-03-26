DO $$
DECLARE
  user_id_to_update uuid;
BEGIN
  -- Find the user ID from the email in the auth.users table
  SELECT id INTO user_id_to_update FROM auth.users WHERE email = 'your-admin@example.com';

  -- If the user is found, update their subscription_plan in the public.profiles table
  IF user_id_to_update IS NOT NULL THEN
    UPDATE public.profiles
    SET subscription_plan = 'admin'
    WHERE id = user_id_to_update;
  ELSE
    RAISE NOTICE 'User with email your-admin@example.com not found.';
  END IF;
END $$;
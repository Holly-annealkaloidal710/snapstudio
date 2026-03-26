-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a cron job that runs on the 1st of every month at 00:01 UTC
-- This will call our edge function to allocate monthly points to yearly subscribers
SELECT cron.schedule(
  'monthly-points-allocation',
  '1 0 1 * *', -- At 00:01 on day-of-month 1
  $$
  SELECT
    net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/monthly-points-allocation',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb,
      body := '{}'::jsonb
    ) as request_id;
  $$
);

-- Also create a function to manually trigger the allocation (for testing)
CREATE OR REPLACE FUNCTION trigger_monthly_allocation()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
BEGIN
  SELECT
    net.http_post(
      url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/monthly-points-allocation',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb,
      body := '{}'::jsonb
    ) INTO result;
  
  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users (admins can test)
GRANT EXECUTE ON FUNCTION trigger_monthly_allocation() TO authenticated;

COMMENT ON FUNCTION trigger_monthly_allocation() IS 'Manually trigger monthly points allocation for yearly subscribers';
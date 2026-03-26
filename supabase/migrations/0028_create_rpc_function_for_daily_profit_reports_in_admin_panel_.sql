-- RPC function for daily profit reports
CREATE OR REPLACE FUNCTION public.get_daily_profit_report(
  days_back INTEGER DEFAULT 30,
  mode_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
  day DATE,
  images INTEGER,
  cost_vnd BIGINT,
  revenue_vnd BIGINT,
  profit_vnd BIGINT,
  avg_cost_per_image DECIMAL(10,2),
  margin_percent DECIMAL(5,2)
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  start_date DATE := CURRENT_DATE - days_back;
BEGIN
  RETURN QUERY
  SELECT
    DATE(r.created_at AT TIME ZONE 'Asia/Ho_Chi_Minh') AS day,
    SUM(r.images_generated)::INTEGER AS images,
    SUM(r.cost_vnd)::BIGINT AS cost_vnd,
    COALESCE(SUM(o.amount), 0)::BIGINT AS revenue_vnd,
    (COALESCE(SUM(o.amount), 0) - SUM(r.cost_vnd))::BIGINT AS profit_vnd,
    CASE 
      WHEN SUM(r.images_generated) > 0 THEN 
        SUM(r.cost_vnd)::DECIMAL / SUM(r.images_generated)
      ELSE 0 
    END AS avg_cost_per_image,
    CASE 
      WHEN COALESCE(SUM(o.amount), 0) > 0 THEN
        ((COALESCE(SUM(o.amount), 0) - SUM(r.cost_vnd))::DECIMAL / SUM(o.amount)) * 100
      ELSE 0 
    END AS margin_percent
  FROM public.renders r
  LEFT JOIN public.orders o ON o.user_id = r.user_id 
    AND DATE(o.created_at AT TIME ZONE 'Asia/Ho_Chi_Minh') = DATE(r.created_at AT TIME ZONE 'Asia/Ho_Chi_Minh')
    AND o.status = 'completed'
  WHERE r.created_at >= start_date AT TIME ZONE 'Asia/Ho_Chi_Minh'
    AND (mode_filter IS NULL OR r.mode = mode_filter)
  GROUP BY 1
  ORDER BY 1 DESC;
END;
$$;
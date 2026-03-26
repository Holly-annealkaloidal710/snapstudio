CREATE OR REPLACE FUNCTION public.spend_points(
  _user_id uuid,
  _amount integer,
  _reason text,
  _metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_balance integer;
BEGIN
  IF _amount <= 0 THEN
    RAISE EXCEPTION 'Amount must be positive';
  END IF;

  SELECT points_balance INTO current_balance
  FROM public.profiles
  WHERE id = _user_id
  FOR UPDATE;

  IF current_balance IS NULL THEN
    RAISE EXCEPTION 'Profile not found';
  END IF;

  IF current_balance < _amount THEN
    RETURN FALSE;
  END IF;

  UPDATE public.profiles
  SET points_balance = current_balance - _amount
  WHERE id = _user_id;

  INSERT INTO public.points_ledger (user_id, delta, reason, related_id, metadata)
  VALUES (_user_id, -_amount, COALESCE(_reason, 'spend_generation'), NULL, COALESCE(_metadata, '{}'::jsonb));

  RETURN TRUE;
END;
$$;
CREATE OR REPLACE FUNCTION increment_download_count(image_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE generated_images 
  SET download_count = download_count + 1 
  WHERE id = image_id;
END;
$$;
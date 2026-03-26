SELECT 
  id,
  image_type,
  title,
  description,
  image_url,
  style_name
FROM generated_images 
WHERE is_public = true 
ORDER BY created_at DESC 
LIMIT 12;
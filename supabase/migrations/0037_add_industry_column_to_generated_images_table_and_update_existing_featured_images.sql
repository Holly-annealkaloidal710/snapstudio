-- Add industry column to generated_images table
ALTER TABLE generated_images ADD COLUMN industry TEXT DEFAULT 'other';

-- Update existing featured images with industry tags based on their characteristics
-- This is a simplified assignment - in real scenario, admin would manually tag these
UPDATE generated_images 
SET industry = 'f_b' 
WHERE is_featured = true 
AND (
  title ILIKE '%food%' OR 
  title ILIKE '%drink%' OR 
  title ILIKE '%coffee%' OR 
  title ILIKE '%restaurant%' OR
  description ILIKE '%food%' OR
  description ILIKE '%beverage%'
)
AND industry = 'other';

UPDATE generated_images 
SET industry = 'beauty' 
WHERE is_featured = true 
AND (
  title ILIKE '%beauty%' OR 
  title ILIKE '%cosmetic%' OR 
  title ILIKE '%skincare%' OR 
  title ILIKE '%makeup%' OR
  description ILIKE '%beauty%' OR
  description ILIKE '%cosmetic%'
)
AND industry = 'other';

UPDATE generated_images 
SET industry = 'fashion' 
WHERE is_featured = true 
AND (
  title ILIKE '%fashion%' OR 
  title ILIKE '%clothing%' OR 
  title ILIKE '%apparel%' OR 
  title ILIKE '%accessory%' OR
  description ILIKE '%fashion%' OR
  description ILIKE '%clothing%'
)
AND industry = 'other';

UPDATE generated_images 
SET industry = 'mother_baby' 
WHERE is_featured = true 
AND (
  title ILIKE '%baby%' OR 
  title ILIKE '%mother%' OR 
  title ILIKE '%child%' OR 
  title ILIKE '%kid%' OR
  description ILIKE '%baby%' OR
  description ILIKE '%mother%'
)
AND industry = 'other';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_generated_images_industry_featured 
ON generated_images(industry, is_featured) 
WHERE is_featured = true;
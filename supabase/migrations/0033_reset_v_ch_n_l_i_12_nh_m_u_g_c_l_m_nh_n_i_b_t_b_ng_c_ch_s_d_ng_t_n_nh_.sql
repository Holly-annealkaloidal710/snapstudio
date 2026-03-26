-- Step 1: Un-feature all currently featured images to ensure a clean slate.
UPDATE public.generated_images
SET is_featured = false;

-- Step 2: Select the specific 12 original sample images by their titles to be featured.
-- This method is more reliable as it does not depend on specific IDs.
UPDATE public.generated_images
SET is_featured = true
WHERE title IN (
  'Studio Hero',
  'Luxury Display',
  'Macro Detail',
  'Fashion Model',
  'Lifestyle',
  'Urban Trendy',
  'Social Poster',
  'Seasonal Promo',
  'Carousel',
  'Selfie UGC',
  'Casual Desk',
  'Unboxing'
);
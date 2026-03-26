-- Step 1: Un-feature all currently featured images to start fresh.
UPDATE public.generated_images
SET is_featured = false;

-- Step 2: Select the specific 12 original sample images to be featured.
-- This ensures the homepage defaults to the correct, curated set of images.
UPDATE public.generated_images
SET is_featured = true
WHERE id IN (
  'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f60', -- Studio Hero
  'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f61', -- Luxury Display
  'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f62', -- Macro Detail
  'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f63', -- Fashion Model
  'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f64', -- Lifestyle
  'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f65', -- Urban Trendy
  'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f66', -- Social Poster
  'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f67', -- Seasonal Promo
  'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f68', -- Carousel
  'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f69', -- Selfie UGC
  'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a', -- Casual Desk
  'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6b'  -- Unboxing
);
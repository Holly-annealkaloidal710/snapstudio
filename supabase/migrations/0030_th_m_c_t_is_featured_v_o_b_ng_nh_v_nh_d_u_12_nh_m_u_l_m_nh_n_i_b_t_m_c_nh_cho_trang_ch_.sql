-- Add the is_featured column to generated_images
ALTER TABLE public.generated_images
ADD COLUMN is_featured BOOLEAN NOT NULL DEFAULT false;

-- Create an index for faster lookups on featured images
CREATE INDEX idx_generated_images_is_featured ON public.generated_images (is_featured)
WHERE is_featured = true;

-- Set the first 12 sample images as featured for a good default homepage
-- These are the sample images previously inserted
UPDATE public.generated_images
SET is_featured = true
WHERE id IN (
  'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f60',
  'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f61',
  'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f62',
  'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f63',
  'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f64',
  'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f65',
  'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f66',
  'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f67',
  'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f68',
  'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f69',
  'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a',
  'd1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6b'
);
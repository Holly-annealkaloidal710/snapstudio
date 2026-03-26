-- Add watermarked_image_url column to generated_images table
ALTER TABLE public.generated_images
ADD COLUMN watermarked_image_url TEXT;

-- Add an index for faster lookups on public images without a watermark
CREATE INDEX idx_public_images_without_watermark
ON public.generated_images (id)
WHERE is_public = true AND watermarked_image_url IS NULL;
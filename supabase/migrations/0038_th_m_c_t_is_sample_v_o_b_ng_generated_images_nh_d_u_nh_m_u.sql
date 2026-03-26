-- Add is_sample column to generated_images table
ALTER TABLE generated_images 
ADD COLUMN is_sample BOOLEAN DEFAULT FALSE;

-- Create index for better performance when querying sample images
CREATE INDEX idx_generated_images_sample_lookup 
ON generated_images (industry, image_type, is_sample) 
WHERE is_sample = TRUE;

-- Update RLS policy to allow reading sample images
CREATE POLICY "Anyone can view sample images" ON generated_images 
FOR SELECT USING (is_sample = true);
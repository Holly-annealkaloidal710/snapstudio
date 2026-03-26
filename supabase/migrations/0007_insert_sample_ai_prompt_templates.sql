-- Create prompt_templates table
CREATE TABLE public.prompt_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('display', 'model', 'social', 'seeding')),
  name TEXT NOT NULL,
  prompt_template TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (public read access)
ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Prompt templates are viewable by everyone" ON public.prompt_templates 
FOR SELECT USING (is_active = true);

-- Insert sample prompt templates
INSERT INTO public.prompt_templates (category, name, prompt_template, description) VALUES
-- Display prompts
('display', 'Studio Hero', 'High-end studio product photo of {product} placed at the center, minimal white or gray background, soft diffused light, subtle shadow and reflection, commercial photography style.', 'Ảnh studio chuyên nghiệp, nền trắng tối giản'),
('display', 'Luxury Display', 'Elegant display of {product} on marble or wooden surface, soft spotlight from above, cinematic shadows, premium advertising aesthetic.', 'Trưng bày sang trọng trên nền marble'),
('display', 'Detail Macro', 'Close-up macro shot of {product}, sharp focus on texture and logo details, blurred background, glossy magazine product photography style.', 'Cận cảnh chi tiết texture và logo'),

-- Model prompts
('model', 'On-Model Fashion', 'Professional model wearing or showcasing {product}, neutral outfit, clean studio background, editorial fashion photography.', 'Model chuyên nghiệp showcase sản phẩm'),
('model', 'In-Hand Lifestyle', 'Human hand holding {product} naturally, shot in warm daylight near a window, lifestyle feel, realistic advertising photo.', 'Bàn tay cầm sản phẩm tự nhiên'),
('model', 'Urban Style', 'Model using {product} outdoors in a city street setting, casual stylish outfit, candid moment, authentic lifestyle shot.', 'Sử dụng ngoài đường phố'),

-- Social prompts
('social', 'Poster with Text Space', 'Commercial product photo of {product} centered with negative space on sides, minimal pastel gradient background, perfect for overlaying sale text.', 'Có không gian để thêm text quảng cáo'),
('social', 'Seasonal Theme', '{product} displayed in a seasonal setting (Christmas ornaments, or Tết decorations with peach blossoms), warm festive lighting, styled for holiday campaign.', 'Chủ đề mùa lễ hội, Tết, Noel'),
('social', 'Carousel Set', 'Series of product shots of {product} showing full item, close-up detail, and styled flat-lay, arranged for Instagram carousel, consistent lighting and background tone.', 'Bộ ảnh cho Instagram carousel'),

-- Seeding prompts
('seeding', 'Selfie Style', 'Casual selfie photo of a person holding {product} in a bedroom mirror, natural messy background, amateur phone photo vibe, authentic UGC style.', 'Ảnh selfie tự nhiên với sản phẩm'),
('seeding', 'Everyday Casual', '{product} placed casually on a study desk with books, laptop, and coffee mug around, slightly imperfect lighting, realistic daily use vibe.', 'Sản phẩm trong cuộc sống hàng ngày'),
('seeding', 'Unboxing', 'User-generated style photo of {product} being unboxed, cardboard box half-open, human hands reaching in, smartphone photo realism, slightly imperfect composition.', 'Trải nghiệm mở hộp tự nhiên');
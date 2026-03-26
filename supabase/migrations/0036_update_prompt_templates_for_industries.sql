-- Disable RLS nếu cần (admin role)
-- SET ROLE service_role; -- Nếu cần quyền cao hơn

-- 1. Food & Beverage (f_b)
INSERT INTO public.prompt_templates (category, name, prompt_template, description, is_active, industry, created_at) VALUES
('display', 'F&B Studio Shot', 'Create a professional studio product photo of {product} on white background, high resolution, appetizing lighting, fresh and clean composition, food photography style, sharp details, no distractions, 8k quality.', 'Ảnh studio sạch sẽ cho menu hoặc website F&B', true, 'f_b', NOW()),
('model', 'F&B Model Enjoying', 'Generate a lifestyle photo of a diverse model enjoying {product}, natural lighting, appetizing and mouthwatering, realistic food styling, high resolution, professional food photography, focus on texture and freshness.', 'Người mẫu thưởng thức sản phẩm F&B tự nhiên', true, 'f_b', NOW()),
('social', 'F&B Social Post', 'Create a vibrant social media post featuring {product}, engaging and appetizing composition, bright colors, modern flat lay with props like utensils or ingredients, high resolution, Instagram-ready, food blogger style.', 'Bố cục social media bắt mắt cho F&B', true, 'f_b', NOW()),
('seeding', 'F&B UGC Review', 'Produce a user-generated content style photo of {product}, casual handheld shot, natural lighting, realistic and appetizing, like a customer review on social media, high resolution, authentic food photography.', 'Ảnh UGC chân thực như review khách hàng F&B', true, 'f_b', NOW());

-- 2. Beauty & Personal Care (beauty)
INSERT INTO public.prompt_templates (category, name, prompt_template, description, is_active, industry, created_at) VALUES
('display', 'Beauty Studio Packaging', 'Create a professional beauty product photo of {product} on elegant white or marble background, high resolution, soft natural lighting, clean and minimal composition, focus on packaging and texture, skincare photography style.', 'Ảnh sản phẩm beauty với bao bì sang trọng', true, 'beauty', NOW()),
('model', 'Beauty Model Application', 'Generate a lifestyle photo of a diverse female model applying {product}, natural and glowing skin, soft lighting, realistic application, high resolution, professional beauty photography, emphasize product benefits.', 'Model apply sản phẩm beauty tự nhiên', true, 'beauty', NOW()),
('social', 'Beauty Social Campaign', 'Create a vibrant beauty social media post featuring {product}, engaging and luxurious composition, bright and glowing colors, modern flat lay with beauty props, high resolution, Instagram beauty trend style.', 'Content beauty campaign cho social media', true, 'beauty', NOW()),
('seeding', 'Beauty UGC Review', 'Produce a user-generated content style photo of {product}, casual selfie or mirror shot, natural lighting, realistic and relatable, like a beauty influencer review, high resolution, authentic UGC beauty photography.', 'Ảnh UGC review sản phẩm beauty chân thực', true, 'beauty', NOW());

-- 3. Fashion & Accessories (fashion)
INSERT INTO public.prompt_templates (category, name, prompt_template, description, is_active, industry, created_at) VALUES
('display', 'Fashion Studio Shot', 'Create a professional fashion studio shot of {product}, clean white background, high resolution, perfect lighting, focus on fabric texture and details, editorial fashion photography style, luxurious and elegant.', 'Ảnh studio chuyên nghiệp cho thời trang', true, 'fashion', NOW()),
('display', 'Fashion Luxury Flat-lay', 'Generate a luxury flat-lay photo of {product}, high-end styling, marble or silk background, high resolution, soft elegant lighting, focus on product quality and premium feel, fashion catalog style.', 'Flat-lay sang trọng cho catalog thời trang', true, 'fashion', NOW()),
('model', 'Fashion Model Pose', 'Produce a professional model photo of a diverse model wearing {product}, studio lighting, natural pose, high resolution, editorial fashion style, emphasize fit and style, confident and trendy vibe.', 'Model pose tự nhiên với sản phẩm thời trang', true, 'fashion', NOW()),
('social', 'Fashion Social Post', 'Create an engaging social media fashion post featuring {product}, vibrant and trendy composition, modern lifestyle, high resolution, Instagram and TikTok ready, urban fashion aesthetic.', 'Content social media trendy cho fashion', true, 'fashion', NOW()),
('seeding', 'Fashion UGC OOTD', 'Generate a user-generated content style photo of {product}, casual streetwear look, natural lighting, authentic and relatable, like a fashion influencer OOTD, high resolution, UGC fashion photography.', 'Ảnh UGC OOTD chân thực cho fashion', true, 'fashion', NOW());

-- 4. Mother & Baby (mother_baby)
INSERT INTO public.prompt_templates (category, name, prompt_template, description, is_active, industry, created_at) VALUES
('display', 'Baby Product Safe Display', 'Create a professional baby product photo of {product} on soft pastel background, high resolution, gentle lighting, clean and safe composition, focus on product safety and quality, nursery photography style.', 'Ảnh sản phẩm em bé an toàn và sạch sẽ', true, 'mother_baby', NOW()),
('model', 'Baby Family Lifestyle', 'Generate a warm family lifestyle photo of a parent using {product} with baby, natural and caring moment, soft lighting, high resolution, professional baby photography, emphasize safety and comfort.', 'Khoảnh khắc gia đình ấm áp với sản phẩm em bé', true, 'mother_baby', NOW()),
('social', 'Baby Social Media Post', 'Create a heartwarming social media post featuring {product} for mothers, engaging and family-friendly composition, pastel colors, modern flat lay with baby props, high resolution, parenting content style.', 'Content social media gia đình cho mẹ & bé', true, 'mother_baby', NOW()),
('seeding', 'Baby Parent Review UGC', 'Produce a user-generated content style photo of {product}, casual parent review shot, natural lighting, realistic and trustworthy, like a mom blogger sharing baby product experience, high resolution, authentic UGC.', 'Ảnh UGC review từ bố/mẹ chân thực', true, 'mother_baby', NOW());

-- 5. Other (other) - General templates
INSERT INTO public.prompt_templates (category, name, prompt_template, description, is_active, industry, created_at) VALUES
('display', 'General Studio Display', 'Create a professional product display photo of {product} on clean white background, high resolution, balanced lighting, focus on product features and details, modern product photography style.', 'Ảnh studio chung cho sản phẩm đa ngành', true, 'other', NOW()),
('model', 'General Lifestyle Model', 'Generate a lifestyle photo of a diverse model using {product}, natural setting, high resolution, professional product photography, emphasize functionality and modern design.', 'Người mẫu sử dụng sản phẩm trong đời sống', true, 'other', NOW()),
('social', 'General Social Post', 'Create an engaging social media post featuring {product}, vibrant and innovative composition, modern and tech-savvy, high resolution, social media marketing style.', 'Content social media chung cho sản phẩm', true, 'other', NOW()),
('seeding', 'General UGC Review', 'Produce a user-generated content style photo of {product}, casual everyday use shot, natural lighting, realistic and relatable, like a customer unboxing or review, high resolution, authentic UGC photography.', 'Ảnh UGC review chung cho sản phẩm', true, 'other', NOW());

-- Enable RLS again if disabled
-- SET ROLE app_user; -- Hoặc role phù hợp
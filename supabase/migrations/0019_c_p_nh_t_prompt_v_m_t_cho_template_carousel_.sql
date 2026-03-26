UPDATE prompt_templates
SET 
  prompt_template = 'A vibrant, eye-catching lifestyle photo of {product} being used, perfect for a social media feed. The composition is clean and modern, with a slightly blurred background to make the product pop. Shot with a professional camera, natural lighting.',
  description = 'Ảnh lifestyle bắt mắt, phù hợp cho các bài đăng social media.'
WHERE 
  name = 'Carousel';
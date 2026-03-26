-- First, categorize existing templates
UPDATE public.prompt_templates
SET industry = 'fashion'
WHERE name IN ('Fashion Model', 'Lifestyle', 'Urban Trendy');

-- Add new prompts for F&B
INSERT INTO public.prompt_templates (category, name, prompt_template, description, industry, is_active) VALUES
('display', 'Fresh Ingredients', 'A vibrant, top-down shot of {product} on a clean white marble surface, surrounded by fresh, colorful ingredients like herbs, spices, and vegetables. The lighting is bright and natural, highlighting the textures and freshness of the food.', 'Top-down shot with fresh ingredients.', 'f_b', true),
('model', 'Enjoying the Meal', 'A candid lifestyle photo of a person with a happy expression enjoying {product} at a cozy cafe or restaurant. The focus is on the delicious food, with the person slightly blurred in the background. Soft, warm lighting.', 'Person enjoying the meal in a lifestyle setting.', 'f_b', true),
('social', 'Mouth-watering Close-up', 'An extreme close-up, macro shot of {product}, showing delicious details like melting cheese, dripping sauce, or a perfect crumb. Use a shallow depth of field to make the product pop. Perfect for social media food porn.', 'Extreme close-up showing delicious details.', 'f_b', true);

-- Add new prompts for Beauty
INSERT INTO public.prompt_templates (category, name, prompt_template, description, industry, is_active) VALUES
('display', 'Product Texture Smear', 'A minimalist studio shot of a textural smear of {product} on a clean, neutral background (like glass or stone). The lighting should be clean and bright to highlight the product''s texture and consistency.', 'Aesthetic smear of the product texture.', 'beauty', true),
('model', 'Glowing Skin Application', 'A close-up shot of a model with flawless, glowing skin applying {product}. The focus is on the interaction between the product and the skin, conveying a sense of luxury and effectiveness. Soft, diffused lighting.', 'Model applying product, focusing on glowing skin.', 'beauty', true),
('seeding', 'Shelfie Arrangement', 'A beautifully arranged "shelfie" photo featuring {product} alongside other aesthetic items like plants, candles, and minimalist decor in a modern bathroom setting. Natural daylight from a window.', 'Product arranged beautifully on a shelf.', 'beauty', true);

-- Add new prompts for Mother & Baby
INSERT INTO public.prompt_templates (category, name, prompt_template, description, industry, is_active) VALUES
('display', 'Soft & Gentle Setup', 'A flat lay of {product} on a soft, textured blanket (like wool or cotton) surrounded by cute, safe baby toys and natural elements like a wooden rattle. The color palette is soft and pastel. Gentle, natural lighting.', 'Flat lay on a soft blanket with baby items.', 'mother_baby', true),
('model', 'Cozy Moment with Baby', 'A heartwarming lifestyle shot of a parent using {product} with their happy baby in a bright, cozy nursery. The focus is on the gentle interaction and the loving bond. Soft, warm, and safe atmosphere.', 'Parent and baby in a cozy, heartwarming moment.', 'mother_baby', true),
('seeding', 'Real Nursery Context', 'A realistic photo of {product} placed on a changing table or in a crib within a beautifully decorated, real-life nursery. The shot looks authentic and relatable for new parents.', 'Product in a real, beautiful nursery setting.', 'mother_baby', true);

-- Add 3 more general prompts to 'other' to ensure it has 12 templates
INSERT INTO public.prompt_templates (category, name, prompt_template, description, industry, is_active) VALUES
('display', 'Minimalist Pedestal', 'A clean, minimalist shot of {product} placed on a simple geometric pedestal or block. The background is a solid, muted color. The lighting is sharp and creates soft shadows, emphasizing the product''s form.', 'Product on a simple pedestal, minimalist style.', 'other', true),
('social', 'Dynamic Action Shot', 'A dynamic, frozen-action shot of {product} with a splash of water or powder exploding around it. The background is dark to make the product and action stand out. Dramatic studio lighting.', 'Frozen-action shot with a splash effect.', 'other', true),
('seeding', 'In-Hand UGC', 'A first-person perspective (UGC style) shot of a hand holding {product} against a natural, everyday background like a city street or a park. The focus is on the product, showing its scale and how it looks in a real-world context.', 'User-generated content style, holding the product.', 'other', true);
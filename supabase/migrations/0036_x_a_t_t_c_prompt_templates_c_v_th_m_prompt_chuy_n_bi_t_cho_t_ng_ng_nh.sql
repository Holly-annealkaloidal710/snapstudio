-- Xóa tất cả prompt templates cũ
DELETE FROM prompt_templates;

-- Thêm prompt cho Food & Beverage (F&B)
INSERT INTO prompt_templates (category, name, prompt_template, description, industry) VALUES
-- Display F&B
('display', 'Studio Hero Shot', 'Studio hero shot of {product}, centered on clean white background, soft diffused lighting, subtle shadow, commercial food photography', 'Ảnh studio chuyên nghiệp nền trắng', 'f_b'),
('display', 'Luxury Styled Display', 'Luxury styled display of {product} placed on marble or wooden table, cinematic light, elegant plating', 'Bày trí sang trọng trên bàn đá/gỗ', 'f_b'),
('display', 'Macro Close-up', 'Macro close-up of {product} texture, showing freshness and details, blurred background, high-end menu vibe', 'Cận cảnh texture và độ tươi ngon', 'f_b'),

-- Model F&B
('model', 'Natural Hand Hold', 'Person holding {product} naturally in hand, shot near window with daylight, lifestyle café feel', 'Cầm tự nhiên trong tay, ánh sáng ban ngày', 'f_b'),
('model', 'Dining Experience', 'Model enjoying {product} at dining table, candid smile, warm tones, food influencer style', 'Thưởng thức tại bàn ăn, phong cách influencer', 'f_b'),
('model', 'Urban Street Scene', 'Urban street scene with young person carrying {product}, casual, energetic vibe', 'Bối cảnh đường phố, năng động', 'f_b'),

-- Social F&B
('social', 'Poster Layout', 'Poster-style layout: {product} centered with pastel gradient background and empty space for "New Dish" or "Sale" text', 'Layout poster với không gian cho text', 'f_b'),
('social', 'Seasonal Theme', 'Seasonal food theme: {product} styled with festive decor (Tết flowers or Christmas ornaments), cozy light', 'Chủ đề mùa lễ với decor phù hợp', 'f_b'),
('social', 'Carousel Concept', 'Carousel concept: 3 shots of {product}—full dish, ingredient close-up, styled flat-lay for Instagram', 'Concept carousel cho Instagram', 'f_b'),

-- Seeding F&B
('seeding', 'Casual Selfie', 'Casual selfie with {product} at café table, phone-shot look, authentic UGC style', 'Selfie tự nhiên tại quán café', 'f_b'),
('seeding', 'Everyday Desk', 'Everyday {product} placed on messy desk with laptop and coffee mug, natural lighting', 'Đặt trên bàn làm việc hàng ngày', 'f_b'),
('seeding', 'Amateur Unboxing', 'Amateur unboxing of packaged {product}, hands opening box, smartphone angle', 'Unboxing nghiệp dư với góc điện thoại', 'f_b');

-- Thêm prompt cho Beauty & Personal Care
INSERT INTO prompt_templates (category, name, prompt_template, description, industry) VALUES
-- Display Beauty
('display', 'Luxury Beauty Shot', 'Studio product shot of {product} on clean background with soft reflection, luxury beauty branding', 'Ảnh studio sang trọng với phản chiếu', 'beauty'),
('display', 'Elegant Vanity Display', 'Elegant display of {product} on marble vanity with flowers, gold accents, candlelight', 'Bày trí thanh lịch trên bàn trang điểm', 'beauty'),
('display', 'Macro Beauty Detail', 'Macro close-up of {product} detail (logo, texture, shine), blurred background, glossy magazine style', 'Cận cảnh chi tiết sản phẩm làm đẹp', 'beauty'),

-- Model Beauty
('model', 'Beauty Application', 'Model applying {product} on face or lips, natural skin glow, beauty ad vibe', 'Model sử dụng sản phẩm làm đẹp', 'beauty'),
('model', 'Hand Beauty Shot', 'Hand holding {product} close to camera with blurred background, lifestyle TikTok aesthetic', 'Tay cầm sản phẩm, phong cách TikTok', 'beauty'),
('model', 'Bathroom Lifestyle', 'Model using {product} in modern bathroom, daylight through window, candid shot', 'Sử dụng trong phòng tắm hiện đại', 'beauty'),

-- Social Beauty
('social', 'Beauty Poster', 'Poster layout with {product} centered, pastel gradient background, space for "New Arrival" text', 'Layout poster với gradient pastel', 'beauty'),
('social', 'Seasonal Beauty', 'Seasonal beauty campaign: {product} with Tết blossoms or Christmas lights', 'Chiến dịch làm đẹp theo mùa', 'beauty'),
('social', 'Beauty Carousel', 'Carousel: full product shot, detail close-up, lifestyle flat-lay with cosmetics around', 'Carousel với góc nhìn đa dạng', 'beauty'),

-- Seeding Beauty
('seeding', 'Mirror Selfie', 'Selfie mirror shot holding {product}, phone quality, authentic user vibe', 'Selfie gương với sản phẩm', 'beauty'),
('seeding', 'Desk Snapshot', 'Everyday snapshot of {product} on desk next to laptop, books, coffee', 'Ảnh hàng ngày trên bàn làm việc', 'beauty'),
('seeding', 'Beauty Unboxing', 'Unboxing {product}, hands opening branded packaging, smartphone angle', 'Unboxing sản phẩm làm đẹp', 'beauty');

-- Thêm prompt cho Thời trang & Phụ kiện
INSERT INTO prompt_templates (category, name, prompt_template, description, industry) VALUES
-- Display Fashion
('display', 'Fashion Flat-lay', 'Studio flat-lay of {product} (clothes, shoes, bag) on neutral background, soft shadows', 'Flat-lay studio với bóng mềm', 'fashion'),
('display', 'Luxury Mannequin', 'Luxury mannequin display with spotlight, boutique vibe', 'Mannequin sang trọng với đèn spotlight', 'fashion'),
('display', 'Fabric Detail', 'Detail macro of {product} fabric texture, stitching, or hardware, blurred background', 'Cận cảnh chất liệu và đường may', 'fashion'),

-- Model Fashion
('model', 'Fashion Editorial', 'Model wearing {product} in clean studio, fashion editorial lighting', 'Model mặc trong studio, ánh sáng editorial', 'fashion'),
('model', 'Casual Lifestyle', 'Model holding/wearing {product} casually in everyday environment, natural pose', 'Mặc/cầm tự nhiên trong môi trường hàng ngày', 'fashion'),
('model', 'Streetwear Style', 'Streetwear style: young model with {product} in urban street setting, candid look', 'Phong cách streetwear trên phố', 'fashion'),

-- Social Fashion
('social', 'Fashion Poster', 'Poster layout: {product} centered, bold gradient, empty space for sale text', 'Layout poster với gradient đậm', 'fashion'),
('social', 'Seasonal Fashion', 'Seasonal theme: {product} styled with Tết blossom or holiday setting', 'Chủ đề thời trang theo mùa', 'fashion'),
('social', 'Fashion Carousel', 'Carousel: 3 styled shots—full-body outfit, accessory close-up, street lifestyle', 'Carousel thời trang đa góc độ', 'fashion'),

-- Seeding Fashion
('seeding', 'Mirror Selfie Fashion', 'Selfie mirror with {product}, casual phone vibe', 'Selfie gương với trang phục', 'fashion'),
('seeding', 'Everyday Fashion', 'Everyday shot of {product} lying on chair/desk, natural messy background', 'Ảnh hàng ngày với background tự nhiên', 'fashion'),
('seeding', 'Fashion Unboxing', 'Unboxing {product} from branded bag or box, candid smartphone capture', 'Unboxing thời trang từ túi/hộp', 'fashion');

-- Thêm prompt cho Mother & Baby
INSERT INTO prompt_templates (category, name, prompt_template, description, industry) VALUES
-- Display Mother & Baby
('display', 'Baby Product Studio', 'Studio shot of {product} (bottle, stroller, toy) on white background, soft light', 'Ảnh studio sản phẩm em bé', 'mother_baby'),
('display', 'Nursery Display', 'Cozy display of {product} on nursery table with soft pastel decor', 'Bày trí ấm cúng trong phòng em bé', 'mother_baby'),
('display', 'Safety Detail', 'Detail close-up of {product} material/safety features, blurred background', 'Cận cảnh chất liệu và tính năng an toàn', 'mother_baby'),

-- Model Mother & Baby
('model', 'Family Moment', 'Parent holding baby using {product}, warm family vibe', 'Khoảnh khắc gia đình ấm áp', 'mother_baby'),
('model', 'Parent Hand', 'Parent''s hand holding {product} with baby in background, natural light', 'Tay bố/mẹ cầm sản phẩm với em bé', 'mother_baby'),
('model', 'Baby Playing', 'Everyday candid: baby playing with {product}, cozy home environment', 'Em bé chơi với sản phẩm tại nhà', 'mother_baby'),

-- Social Mother & Baby
('social', 'Baby Poster', 'Poster layout: {product} centered, pastel pink/blue gradient, text space', 'Layout poster với màu pastel', 'mother_baby'),
('social', 'Family Seasonal', 'Seasonal family theme: {product} styled with holiday/nursery decor', 'Chủ đề gia đình theo mùa', 'mother_baby'),
('social', 'Baby Carousel', 'Carousel: shots showing {product} in use—packaging, detail, lifestyle with baby', 'Carousel sản phẩm em bé đang sử dụng', 'mother_baby'),

-- Seeding Mother & Baby
('seeding', 'Parent Selfie', 'Selfie with parent + baby holding {product}, casual authenticity', 'Selfie bố/mẹ và con với sản phẩm', 'mother_baby'),
('seeding', 'Baby Room Everyday', 'Everyday desk/bedroom shot: {product} lying around baby''s things', 'Ảnh hàng ngày trong phòng em bé', 'mother_baby'),
('seeding', 'Parent Unboxing', 'Amateur unboxing of {product} from package, parent''s hand opening box', 'Bố/mẹ unboxing sản phẩm cho con', 'mother_baby');

-- Cập nhật prompt cho Other (đã có sẵn) để phù hợp với electronics, home, misc
UPDATE prompt_templates SET 
  prompt_template = CASE name
    WHEN 'Studio Hero' THEN 'Studio tech shot of {product} on black gradient, reflection, premium vibe'
    WHEN 'Luxury Display' THEN 'Lifestyle display of {product} in real context (desk, living room)'
    WHEN 'Macro Detail' THEN 'Macro close-up of {product} button/material/logo, blurred background'
    WHEN 'Fashion Model' THEN 'Person holding {product} in hand, focus on size and usability'
    WHEN 'Lifestyle' THEN 'Model using {product} in workspace/home, candid natural light'
    WHEN 'Urban Trendy' THEN 'Outdoor lifestyle shot with {product}, casual everyday usage'
    WHEN 'Social Poster' THEN 'Poster layout with {product} centered, bold tech gradient background'
    WHEN 'Seasonal Promo' THEN 'Seasonal tech theme: {product} with Tết or festive decoration'
    WHEN 'Carousel' THEN 'Carousel: product shot, close-up detail, lifestyle placement'
    WHEN 'Selfie UGC' THEN 'Selfie showing {product} in use, phone-like angle'
    WHEN 'Casual Desk' THEN 'Everyday casual: {product} placed on messy desk with personal items'
    WHEN 'Unboxing' THEN 'Amateur unboxing of {product}, hands opening packaging'
    ELSE prompt_template
  END,
  description = CASE name
    WHEN 'Studio Hero' THEN 'Ảnh studio tech với gradient đen'
    WHEN 'Luxury Display' THEN 'Hiển thị trong bối cảnh thực tế'
    WHEN 'Macro Detail' THEN 'Cận cảnh nút bấm/chất liệu/logo'
    WHEN 'Fashion Model' THEN 'Cầm trong tay, tập trung vào kích thước'
    WHEN 'Lifestyle' THEN 'Sử dụng tại workspace/nhà'
    WHEN 'Urban Trendy' THEN 'Sử dụng ngoài trời, hàng ngày'
    WHEN 'Social Poster' THEN 'Layout poster với gradient tech'
    WHEN 'Seasonal Promo' THEN 'Chủ đề tech theo mùa'
    WHEN 'Carousel' THEN 'Carousel đa góc độ'
    WHEN 'Selfie UGC' THEN 'Selfie sử dụng sản phẩm'
    WHEN 'Casual Desk' THEN 'Đặt trên bàn làm việc bừa bộn'
    WHEN 'Unboxing' THEN 'Unboxing nghiệp dư'
    ELSE description
  END
WHERE industry = 'other';
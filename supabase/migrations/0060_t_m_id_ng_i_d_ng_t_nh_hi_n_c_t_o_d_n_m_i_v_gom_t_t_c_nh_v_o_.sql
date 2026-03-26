-- Bước 1: Tìm một ID người dùng hợp lệ từ một trong những ảnh đã tạo của bạn.
-- Đây là cách giải quyết cốt lõi, suy ra bạn là ai từ dữ liệu hiện có.
WITH valid_user AS (
    SELECT user_id
    FROM public.generated_images
    WHERE user_id IS NOT NULL
    LIMIT 1
),
-- Bước 2: Tạo một dự án "tổng hợp" mới bằng ID người dùng đã tìm thấy.
new_project AS (
    INSERT INTO public.projects (user_id, name, product_name, industry)
    SELECT
        user_id,
        'Dự án Tổng hợp (Đã khôi phục)',
        'Nhiều sản phẩm',
        'other'
    FROM valid_user
    RETURNING id, user_id
)
-- Bước 3: Cập nhật tất cả các ảnh "lạc" của bạn để chúng thuộc về dự án mới này
-- và đảm bảo chúng cũng có ID người dùng chính xác.
UPDATE public.generated_images
SET
    project_id = (SELECT id FROM new_project),
    user_id = (SELECT user_id FROM new_project)
WHERE
    project_id IS NULL OR
    project_id NOT IN (SELECT id FROM public.projects WHERE user_id = (SELECT user_id FROM new_project));
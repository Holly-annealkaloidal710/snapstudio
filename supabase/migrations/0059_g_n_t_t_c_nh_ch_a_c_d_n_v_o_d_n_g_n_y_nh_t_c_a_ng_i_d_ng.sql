-- Bước 1: Tìm dự án gần đây nhất của người dùng hiện tại và lưu ID của nó.
WITH latest_project AS (
    SELECT id
    FROM public.projects
    WHERE user_id = auth.uid()
    ORDER BY created_at DESC
    LIMIT 1
)
-- Bước 2: Cập nhật tất cả các ảnh được tạo bởi người dùng hiện tại nhưng chưa có project_id.
-- Gán project_id của chúng bằng ID của dự án gần đây nhất đã tìm thấy ở Bước 1.
UPDATE public.generated_images
SET project_id = (SELECT id FROM latest_project)
WHERE
    user_id = auth.uid()
    AND project_id IS NULL;
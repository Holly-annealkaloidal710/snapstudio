-- Step 1: Add thumbnail_url column to generated_images table
ALTER TABLE public.generated_images
ADD COLUMN thumbnail_url TEXT;

-- Step 2: Recreate the community_feed view to include the new columns
DROP VIEW IF EXISTS public.community_feed;
CREATE OR REPLACE VIEW public.community_feed AS
SELECT
  gi.id,
  gi.title,
  gi.description,
  gi.image_url,
  gi.watermarked_image_url,
  gi.thumbnail_url,
  gi.user_id,
  gi.created_at,
  p.full_name,
  p.email,
  (SELECT COUNT(*) FROM community_likes cl WHERE cl.image_id = gi.id) AS like_count,
  (SELECT COUNT(*) FROM community_comments cc WHERE cc.image_id = gi.id) AS comment_count
FROM
  generated_images gi
JOIN
  profiles p ON gi.user_id = p.id
WHERE
  gi.is_public = true;

-- Step 3: Update the get_recent_projects_with_thumbnails function
DROP FUNCTION IF EXISTS public.get_recent_projects_with_thumbnails(uuid);
CREATE OR REPLACE FUNCTION public.get_recent_projects_with_thumbnails(p_user_id uuid)
RETURNS TABLE(id uuid, name text, created_at timestamp with time zone, image_count bigint, thumbnail_url text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.name,
    p.created_at,
    COALESCE(img_counts.image_count, 0) as image_count,
    thumbnails.thumbnail_url as thumbnail_url
  FROM public.projects p
  LEFT JOIN (
    SELECT
      project_id,
      COUNT(*) as image_count
    FROM public.generated_images
    WHERE user_id = p_user_id
    GROUP BY project_id
  ) img_counts ON p.id = img_counts.project_id
  LEFT JOIN (
    SELECT DISTINCT ON (project_id)
      project_id,
      COALESCE(thumbnail_url, image_url) as thumbnail_url
    FROM public.generated_images
    WHERE user_id = p_user_id
    ORDER BY project_id, created_at DESC
  ) thumbnails ON p.id = thumbnails.project_id
  WHERE p.user_id = p_user_id
  ORDER BY p.updated_at DESC;
END;
$function$;
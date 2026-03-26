CREATE OR REPLACE FUNCTION public.get_recent_projects_with_thumbnails(p_user_id uuid)
RETURNS TABLE(
  id uuid,
  name text,
  created_at timestamp with time zone,
  image_count bigint,
  thumbnail_url text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
  ORDER BY p.updated_at DESC
  LIMIT 5;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_recent_projects_with_thumbnails(uuid) TO authenticated;